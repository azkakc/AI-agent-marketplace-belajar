# Nexus Security Specification

## Data Invariants
1. An agent must have a price >= 0.
2. A deployment must link a valid user to a valid agent.
3. Users can only update their own profile (except for earnings, which is system-managed).
4. Agents can only be edited by their creators.
5. Transactions are immutable after creation.

## The Dirty Dozen Payloads (Target: DENIED)
1. **Agent Spoofing**: Attempting to create an agent with `creatorId` not matching `request.auth.uid`.
2. **Earnings Injection**: A user attempting to manually increase their `earnings` in their profile.
3. **Price Manipulation**: Updating an agent's `price` to a negative value.
4. **Instruction Theft**: Reading another user's `instructions` for a private agent (if we had private agents, but marketplace agents are public). *Correction*: Accessing private deployment settings of another user.
5. **Role Escalation**: Setting `role` to `admin` during profile creation.
6. **Orphaned Deployment**: Creating a deployment for a non-existent agent.
7. **Ghost Transaction**: Creating a transaction without a corresponding `purchasedAt` update in deployments (requires batching/existsAfter).
8. **Shadow Update**: Adding a `verified` field to an agent document when not authorized.
9. **Identity Poisoning**: Using a 1MB string for a `userId` in a transaction.
10. **Rate Limiting / Denial of Wallet**: Rapidly creating agents to exhaust Firestore quota.
11. **Cross-User Deployment Control**: Attempting to pause another user's deployment.
12. **PII Leak**: Reading private user info (e.g. `email` if we stored it, let's assume `walletAddress` as PII).

## Test Runner (TDD)
I will implement `firestore.rules` to prevent these.
