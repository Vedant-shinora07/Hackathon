// ─────────────────────────────────────────────────────────────────────────────
// VanRakshak — Public Routes (no auth)
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { provenance, qrLookup, verify, permitAudit, getJourney } from '../controllers/publicController.js';

const router = Router();

router.get('/batch/:batchId/provenance', provenance);
router.get('/qr/:qrHash', qrLookup);
router.get('/verify/:batchId', verify);
router.get('/permit/:permitNumber/audit', permitAudit);
router.get('/batch/:batchId/journey', getJourney);

export default router;

// ✓ FILE COMPLETE: routes/publicRoutes.js
