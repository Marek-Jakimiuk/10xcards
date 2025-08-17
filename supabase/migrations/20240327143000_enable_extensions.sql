-- Migration: Enable Required Extensions
-- Description: Enables the UUID extension required for the schema
-- Author: AI Assistant
-- Date: 2024-03-27

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp"; 