ALTER TABLE custody_events
  ADD COLUMN gps_lat DECIMAL(10,7) NULL AFTER location,
  ADD COLUMN gps_lng DECIMAL(10,7) NULL AFTER gps_lat;

ALTER TABLE product_batches
  ADD COLUMN delivery_lat DECIMAL(10,7) NULL,
  ADD COLUMN delivery_lng DECIMAL(10,7) NULL;
