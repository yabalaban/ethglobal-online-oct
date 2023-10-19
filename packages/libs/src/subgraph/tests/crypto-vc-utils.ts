import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ProjectCompleted,
  ProjectCreated,
  ProjectFunded,
  ProjectStarted,
  TrancheClaimed,
  TrancheFailed,
  TrancheRequested
} from "../generated/CryptoVC/CryptoVC"

export function createProjectCompletedEvent(
  projectId: Bytes
): ProjectCompleted {
  let projectCompletedEvent = changetype<ProjectCompleted>(newMockEvent())

  projectCompletedEvent.parameters = new Array()

  projectCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )

  return projectCompletedEvent
}

export function createProjectCreatedEvent(
  projectId: Bytes,
  creator: Address,
  ethCollateralDeposit: BigInt,
  fundingRequired: BigInt,
  cid: Bytes
): ProjectCreated {
  let projectCreatedEvent = changetype<ProjectCreated>(newMockEvent())

  projectCreatedEvent.parameters = new Array()

  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ethCollateralDeposit",
      ethereum.Value.fromUnsignedBigInt(ethCollateralDeposit)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fundingRequired",
      ethereum.Value.fromUnsignedBigInt(fundingRequired)
    )
  )
  projectCreatedEvent.parameters.push(
    new ethereum.EventParam("cid", ethereum.Value.fromBytes(cid))
  )

  return projectCreatedEvent
}

export function createProjectFundedEvent(
  projectId: Bytes,
  funder: Address,
  amount: BigInt
): ProjectFunded {
  let projectFundedEvent = changetype<ProjectFunded>(newMockEvent())

  projectFundedEvent.parameters = new Array()

  projectFundedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  projectFundedEvent.parameters.push(
    new ethereum.EventParam("funder", ethereum.Value.fromAddress(funder))
  )
  projectFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return projectFundedEvent
}

export function createProjectStartedEvent(
  projectId: Bytes,
  safe: Address
): ProjectStarted {
  let projectStartedEvent = changetype<ProjectStarted>(newMockEvent())

  projectStartedEvent.parameters = new Array()

  projectStartedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  projectStartedEvent.parameters.push(
    new ethereum.EventParam("safe", ethereum.Value.fromAddress(safe))
  )

  return projectStartedEvent
}

export function createTrancheClaimedEvent(
  trancheId: Bytes,
  projectId: Bytes,
  amount: BigInt
): TrancheClaimed {
  let trancheClaimedEvent = changetype<TrancheClaimed>(newMockEvent())

  trancheClaimedEvent.parameters = new Array()

  trancheClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "trancheId",
      ethereum.Value.fromFixedBytes(trancheId)
    )
  )
  trancheClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  trancheClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return trancheClaimedEvent
}

export function createTrancheFailedEvent(
  trancheId: Bytes,
  projectId: Bytes,
  amount: BigInt
): TrancheFailed {
  let trancheFailedEvent = changetype<TrancheFailed>(newMockEvent())

  trancheFailedEvent.parameters = new Array()

  trancheFailedEvent.parameters.push(
    new ethereum.EventParam(
      "trancheId",
      ethereum.Value.fromFixedBytes(trancheId)
    )
  )
  trancheFailedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  trancheFailedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return trancheFailedEvent
}

export function createTrancheRequestedEvent(
  trancheId: Bytes,
  projectId: Bytes,
  amount: BigInt,
  claim: Bytes
): TrancheRequested {
  let trancheRequestedEvent = changetype<TrancheRequested>(newMockEvent())

  trancheRequestedEvent.parameters = new Array()

  trancheRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "trancheId",
      ethereum.Value.fromFixedBytes(trancheId)
    )
  )
  trancheRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "projectId",
      ethereum.Value.fromFixedBytes(projectId)
    )
  )
  trancheRequestedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  trancheRequestedEvent.parameters.push(
    new ethereum.EventParam("claim", ethereum.Value.fromBytes(claim))
  )

  return trancheRequestedEvent
}
