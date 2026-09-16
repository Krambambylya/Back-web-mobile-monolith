#!/usr/bin/env bash
# Recreate the "Protect main" ruleset after using this repo as a GitHub template.
# Template copies do not inherit rulesets. Requires: gh auth, admin on the repo.
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI (gh) and run: gh auth login" >&2
  exit 1
fi

repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
existing="$(gh api "repos/${repo}/rulesets" --jq '.[] | select(.name=="Protect main") | .id' || true)"

if [[ -n "$existing" ]]; then
  echo "Ruleset \"Protect main\" already exists on ${repo} (id ${existing})."
  exit 0
fi

gh api --method POST "repos/${repo}/rulesets" --input - <<'EOF'
{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["merge", "squash", "rebase"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "verify", "integration_id": 15368 },
          { "context": "secrets", "integration_id": 15368 }
        ]
      }
    }
  ]
}
EOF

echo "Created ruleset \"Protect main\" on ${repo}."
echo "Direct pushes to main are blocked. Open a PR and merge after verify + secrets are green."
