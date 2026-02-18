ALTER TABLE facilities ALTER COLUMN accepted_materials TYPE jsonb USING to_jsonb(accepted_materials);
