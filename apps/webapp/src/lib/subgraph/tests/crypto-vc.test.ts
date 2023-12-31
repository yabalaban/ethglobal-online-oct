import { assert, describe, test, clearStore, beforeAll, afterAll } from 'matchstick-as';
import { Bytes, Address, BigInt } from '@graphprotocol/graph-ts';
import { ProjectCompleted } from '../generated/schema';
import { ProjectCompleted as ProjectCompletedEvent } from '../generated/CryptoVC/CryptoVC';
import { handleProjectCompleted } from '../src/crypto-vc';
import { createProjectCompletedEvent } from './crypto-vc-utils';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let projectId = Bytes.fromI32(1234567890);
    let newProjectCompletedEvent = createProjectCompletedEvent(projectId);
    handleProjectCompleted(newProjectCompletedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test('ProjectCompleted created and stored', () => {
    assert.entityCount('ProjectCompleted', 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      'ProjectCompleted',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
      'projectId',
      '1234567890',
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
