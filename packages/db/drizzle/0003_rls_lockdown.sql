DO $$
DECLARE
	r record;
	role_name text;
BEGIN
	FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
	LOOP
		EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
		EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC', r.tablename);
		FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated']
		LOOP
			IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
				EXECUTE format('REVOKE ALL ON TABLE public.%I FROM %I', r.tablename, role_name);
			END IF;
		END LOOP;
	END LOOP;
END $$;
