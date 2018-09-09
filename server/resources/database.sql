--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

-- Started on 2018-09-09 14:30:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2809 (class 1262 OID 16403)
-- Name: graphically; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE graphically WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_India.1252' LC_CTYPE = 'English_India.1252';


ALTER DATABASE graphically OWNER TO postgres;

\connect graphically

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2810 (class 0 OID 0)
-- Dependencies: 2809
-- Name: DATABASE graphically; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE graphically IS 'To save and manage data related to graph information';


--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2812 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 199 (class 1259 OID 16427)
-- Name: configmaster; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configmaster (
    "table" character varying(50),
    master_circle character varying(50),
    parent_circle character varying(50),
    children_circle character varying(50),
    parent_size character varying(50),
    children_size character varying(50),
    parent_tooltip character varying(50),
    children_tooltip character varying(50),
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.configmaster OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16404)
-- Name: shipments_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments_data (
    shipment_id integer,
    source_id character varying(20),
    destination_id character varying(20),
    date date,
    weight integer,
    cost integer,
    new_shipment_id integer,
    new_weight integer,
    new_cost integer,
    total_tls integer
);


ALTER TABLE public.shipments_data OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16412)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "firstName" character varying(255),
    "lastName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16410)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2813 (class 0 OID 0)
-- Dependencies: 197
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2679 (class 2604 OID 16415)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2682 (class 2606 OID 16420)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2018-09-09 14:30:19

--
-- PostgreSQL database dump complete
--

