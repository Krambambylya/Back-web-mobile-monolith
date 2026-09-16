#!/bin/sh
set -eu

pnpm --filter backend exec prisma migrate deploy
exec pnpm --filter backend start
