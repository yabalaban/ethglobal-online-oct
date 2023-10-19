import {
  ProjectCompleted as ProjectCompletedEvent,
  ProjectCreated as ProjectCreatedEvent,
  ProjectFunded as ProjectFundedEvent,
  ProjectStarted as ProjectStartedEvent,
  TrancheClaimed as TrancheClaimedEvent,
  TrancheFailed as TrancheFailedEvent,
  TrancheRequested as TrancheRequestedEvent
} from "../generated/CryptoVC/CryptoVC"
import {
  ProjectCompleted,
  ProjectCreated,
  ProjectFunded,
  ProjectStarted,
  TrancheClaimed,
  TrancheFailed,
  TrancheRequested
} from "../generated/schema"

export function handleProjectCompleted(event: ProjectCompletedEvent): void {
  let entity = new ProjectCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectCreated(event: ProjectCreatedEvent): void {
  let entity = new ProjectCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.creator = event.params.creator
  entity.ethCollateralDeposit = event.params.ethCollateralDeposit
  entity.fundingRequired = event.params.fundingRequired
  entity.cid = event.params.cid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectFunded(event: ProjectFundedEvent): void {
  let entity = new ProjectFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.funder = event.params.funder
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProjectStarted(event: ProjectStartedEvent): void {
  let entity = new ProjectStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.projectId = event.params.projectId
  entity.safe = event.params.safe

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrancheClaimed(event: TrancheClaimedEvent): void {
  let entity = new TrancheClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trancheId = event.params.trancheId
  entity.projectId = event.params.projectId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrancheFailed(event: TrancheFailedEvent): void {
  let entity = new TrancheFailed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trancheId = event.params.trancheId
  entity.projectId = event.params.projectId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrancheRequested(event: TrancheRequestedEvent): void {
  let entity = new TrancheRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trancheId = event.params.trancheId
  entity.projectId = event.params.projectId
  entity.amount = event.params.amount
  entity.claim = event.params.claim

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
