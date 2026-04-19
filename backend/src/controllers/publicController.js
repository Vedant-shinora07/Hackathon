// ─────────────────────────────────────────────────────────────────────────────
// VanRakshak — Public Controller
// Unauthenticated endpoints for provenance, QR, verification, and permit audit.
// ─────────────────────────────────────────────────────────────────────────────

import { query } from '../models/db.js';
import { getFullProvenance } from '../services/custodyService.js';
import { resolveQR } from '../services/qrService.js';
import { verifyChain, verifyBatchesForPermit } from '../blockchain/index.js';

/**
 * GET /api/public/batch/:batchId/provenance
 */
export async function provenance(req, res) {
  const data = await getFullProvenance(req.params.batchId);
  if (!data.batch && data.events.length === 0) {
    return res.status(404).json({ error: 'Batch not found.' });
  }
  res.json({ batchData: data.batch, provenance: data.events });
}

/**
 * GET /api/public/qr/:qrHash
 */
export async function qrLookup(req, res) {
  const data = await resolveQR(req.params.qrHash);
  res.json({ batchData: data.batch, provenance: data.events });
}

/**
 * GET /api/public/verify/:batchId
 */
export async function verify(req, res) {
  const result = await verifyChain(req.params.batchId);
  res.json(result);
}

/**
 * GET /api/public/permit/:permitNumber/audit
 */
export async function permitAudit(req, res) {
  const { permitNumber } = req.params;
  const batches = await query(
    `SELECT pb.*, p.permit_number, p.block_name, h.name AS harvester_name
     FROM product_batches pb
     JOIN permits p ON pb.permit_id = p.id
     JOIN users h ON pb.harvester_id = h.id
     WHERE p.permit_number = ?
     ORDER BY pb.created_at DESC`,
    [permitNumber],
  );
  const verification = await verifyBatchesForPermit(permitNumber);
  res.json({ batches, verification });
}

/**
 * GET /api/public/batch/:batchId/journey
 * Returns all GPS-tagged custody events for a batch, ordered chronologically,
 * with total haversine distance between consecutive points.
 */
export async function getJourney(req, res) {
  const { batchId } = req.params;

  // Get all custody events with GPS, in order
  const events = await query(
    `SELECT
       ce.id,
       ce.event_type,
       ce.gps_lat,
       ce.gps_lng,
       ce.location,
       ce.timestamp,
       ce.quantity_kg,
       ce.blockchain_tx_hash,
       u.name  AS actor_name,
       u.role  AS actor_role
     FROM custody_events ce
     JOIN users u ON ce.actor_user_id = u.id
     WHERE ce.batch_id = ?
       AND ce.gps_lat IS NOT NULL
       AND ce.gps_lng IS NOT NULL
     ORDER BY ce.id ASC`,
    [batchId],
  );

  // Get batch + permit info
  const [batch] = await query(
    `SELECT pb.batch_id, pb.product_type, pb.status,
            pb.delivery_lat, pb.delivery_lng,
            p.permit_number, p.block_name
     FROM product_batches pb
     JOIN permits p ON pb.permit_id = p.id
     WHERE pb.batch_id = ?`,
    [batchId],
  );

  if (!batch) {
    return res.status(404).json({ error: 'Batch not found' });
  }

  // Build journey points array for the map
  const points = events.map(e => ({
    id:           e.id,
    eventType:    e.event_type,
    lat:          parseFloat(e.gps_lat),
    lng:          parseFloat(e.gps_lng),
    location:     e.location,
    actorName:    e.actor_name,
    actorRole:    e.actor_role,
    quantity:     e.quantity_kg,
    txHash:       e.blockchain_tx_hash,
    timestamp:    e.timestamp,
  }));

  // Calculate total distance in km between consecutive GPS points
  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  let totalDistanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistanceKm += haversineKm(
      points[i - 1].lat, points[i - 1].lng,
      points[i].lat,     points[i].lng,
    );
  }

  return res.json({
    batchId,
    productType:     batch.product_type,
    status:          batch.status,
    permitNumber:    batch.permit_number,
    blockName:       batch.block_name,
    totalPoints:     points.length,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    points,
  });
}

// ✓ FILE COMPLETE: controllers/publicController.js
