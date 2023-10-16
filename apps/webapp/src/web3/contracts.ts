import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi';
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CryptoVC
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cryptoVcABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'defaultCurrency_', internalType: 'contract IERC20', type: 'address' },
      { name: 'umaOracle_', internalType: 'contract OptimisticOracleV3Interface', type: 'address' },
      { name: 'savingsDai_', internalType: 'contract ISavingsDai', type: 'address' },
      {
        name: 'sparkETHGateway_',
        internalType: 'contract IWrappedTokenGatewayV3',
        type: 'address',
      },
      {
        name: 'sparkPoolAddressesProvider_',
        internalType: 'contract IPoolAddressesProvider',
        type: 'address',
      },
      { name: 'safeFactory_', internalType: 'contract SafeProxyFactory', type: 'address' },
      { name: 'safeSignleton_', internalType: 'address', type: 'address' },
      { name: 'trustredForwarder_', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true }],
    name: 'ProjectCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'creator', internalType: 'address', type: 'address', indexed: true },
      { name: 'ethCollateralDeposit', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'fundingRequired', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'cid', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ProjectCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'funder', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProjectFunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true }],
    name: 'ProjectStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'trancheId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TrancheClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'trancheId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TrancheFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'trancheId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'projectId', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'claim', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'TrancheRequested',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MIN_VALUE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'assertionDisputedCallback',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'assertionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'assertedTruthfully', internalType: 'bool', type: 'bool' },
    ],
    name: 'assertionResolvedCallback',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'cid', internalType: 'bytes', type: 'bytes' },
      { name: 'fundingRequired', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProject',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'defaultCurrency',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fundProject',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'forwarder', internalType: 'address', type: 'address' }],
    name: 'isTrustedForwarder',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'bytes32', type: 'bytes32' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'claim', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'requestTranche',
    outputs: [],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link cryptoVcABI}__.
 */
export function useCryptoVcRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof cryptoVcABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: cryptoVcABI, ...config } as UseContractReadConfig<
    typeof cryptoVcABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"MIN_VALUE"`.
 */
export function useCryptoVcMinValue<
  TFunctionName extends 'MIN_VALUE',
  TSelectData = ReadContractResult<typeof cryptoVcABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: cryptoVcABI,
    functionName: 'MIN_VALUE',
    ...config,
  } as UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"defaultCurrency"`.
 */
export function useCryptoVcDefaultCurrency<
  TFunctionName extends 'defaultCurrency',
  TSelectData = ReadContractResult<typeof cryptoVcABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: cryptoVcABI,
    functionName: 'defaultCurrency',
    ...config,
  } as UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"isTrustedForwarder"`.
 */
export function useCryptoVcIsTrustedForwarder<
  TFunctionName extends 'isTrustedForwarder',
  TSelectData = ReadContractResult<typeof cryptoVcABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: cryptoVcABI,
    functionName: 'isTrustedForwarder',
    ...config,
  } as UseContractReadConfig<typeof cryptoVcABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__.
 */
export function useCryptoVcWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof cryptoVcABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof cryptoVcABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, TFunctionName, TMode>({
    abi: cryptoVcABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"assertionDisputedCallback"`.
 */
export function useCryptoVcAssertionDisputedCallback<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof cryptoVcABI,
          'assertionDisputedCallback'
        >['request']['abi'],
        'assertionDisputedCallback',
        TMode
      > & { functionName?: 'assertionDisputedCallback' }
    : UseContractWriteConfig<typeof cryptoVcABI, 'assertionDisputedCallback', TMode> & {
        abi?: never;
        functionName?: 'assertionDisputedCallback';
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, 'assertionDisputedCallback', TMode>({
    abi: cryptoVcABI,
    functionName: 'assertionDisputedCallback',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"assertionResolvedCallback"`.
 */
export function useCryptoVcAssertionResolvedCallback<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof cryptoVcABI,
          'assertionResolvedCallback'
        >['request']['abi'],
        'assertionResolvedCallback',
        TMode
      > & { functionName?: 'assertionResolvedCallback' }
    : UseContractWriteConfig<typeof cryptoVcABI, 'assertionResolvedCallback', TMode> & {
        abi?: never;
        functionName?: 'assertionResolvedCallback';
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, 'assertionResolvedCallback', TMode>({
    abi: cryptoVcABI,
    functionName: 'assertionResolvedCallback',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"createProject"`.
 */
export function useCryptoVcCreateProject<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof cryptoVcABI, 'createProject'>['request']['abi'],
        'createProject',
        TMode
      > & { functionName?: 'createProject' }
    : UseContractWriteConfig<typeof cryptoVcABI, 'createProject', TMode> & {
        abi?: never;
        functionName?: 'createProject';
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, 'createProject', TMode>({
    abi: cryptoVcABI,
    functionName: 'createProject',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"fundProject"`.
 */
export function useCryptoVcFundProject<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof cryptoVcABI, 'fundProject'>['request']['abi'],
        'fundProject',
        TMode
      > & { functionName?: 'fundProject' }
    : UseContractWriteConfig<typeof cryptoVcABI, 'fundProject', TMode> & {
        abi?: never;
        functionName?: 'fundProject';
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, 'fundProject', TMode>({
    abi: cryptoVcABI,
    functionName: 'fundProject',
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"requestTranche"`.
 */
export function useCryptoVcRequestTranche<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof cryptoVcABI, 'requestTranche'>['request']['abi'],
        'requestTranche',
        TMode
      > & { functionName?: 'requestTranche' }
    : UseContractWriteConfig<typeof cryptoVcABI, 'requestTranche', TMode> & {
        abi?: never;
        functionName?: 'requestTranche';
      } = {} as any,
) {
  return useContractWrite<typeof cryptoVcABI, 'requestTranche', TMode>({
    abi: cryptoVcABI,
    functionName: 'requestTranche',
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__.
 */
export function usePrepareCryptoVcWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof cryptoVcABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: cryptoVcABI, ...config } as UsePrepareContractWriteConfig<
    typeof cryptoVcABI,
    TFunctionName
  >);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"assertionDisputedCallback"`.
 */
export function usePrepareCryptoVcAssertionDisputedCallback(
  config: Omit<
    UsePrepareContractWriteConfig<typeof cryptoVcABI, 'assertionDisputedCallback'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: cryptoVcABI,
    functionName: 'assertionDisputedCallback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof cryptoVcABI, 'assertionDisputedCallback'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"assertionResolvedCallback"`.
 */
export function usePrepareCryptoVcAssertionResolvedCallback(
  config: Omit<
    UsePrepareContractWriteConfig<typeof cryptoVcABI, 'assertionResolvedCallback'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: cryptoVcABI,
    functionName: 'assertionResolvedCallback',
    ...config,
  } as UsePrepareContractWriteConfig<typeof cryptoVcABI, 'assertionResolvedCallback'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"createProject"`.
 */
export function usePrepareCryptoVcCreateProject(
  config: Omit<
    UsePrepareContractWriteConfig<typeof cryptoVcABI, 'createProject'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: cryptoVcABI,
    functionName: 'createProject',
    ...config,
  } as UsePrepareContractWriteConfig<typeof cryptoVcABI, 'createProject'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"fundProject"`.
 */
export function usePrepareCryptoVcFundProject(
  config: Omit<
    UsePrepareContractWriteConfig<typeof cryptoVcABI, 'fundProject'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: cryptoVcABI,
    functionName: 'fundProject',
    ...config,
  } as UsePrepareContractWriteConfig<typeof cryptoVcABI, 'fundProject'>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link cryptoVcABI}__ and `functionName` set to `"requestTranche"`.
 */
export function usePrepareCryptoVcRequestTranche(
  config: Omit<
    UsePrepareContractWriteConfig<typeof cryptoVcABI, 'requestTranche'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: cryptoVcABI,
    functionName: 'requestTranche',
    ...config,
  } as UsePrepareContractWriteConfig<typeof cryptoVcABI, 'requestTranche'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__.
 */
export function useCryptoVcEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof cryptoVcABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: cryptoVcABI, ...config } as UseContractEventConfig<
    typeof cryptoVcABI,
    TEventName
  >);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"ProjectCompleted"`.
 */
export function useCryptoVcProjectCompletedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'ProjectCompleted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'ProjectCompleted',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'ProjectCompleted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"ProjectCreated"`.
 */
export function useCryptoVcProjectCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'ProjectCreated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'ProjectCreated',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'ProjectCreated'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"ProjectFunded"`.
 */
export function useCryptoVcProjectFundedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'ProjectFunded'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'ProjectFunded',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'ProjectFunded'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"ProjectStarted"`.
 */
export function useCryptoVcProjectStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'ProjectStarted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'ProjectStarted',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'ProjectStarted'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"TrancheClaimed"`.
 */
export function useCryptoVcTrancheClaimedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'TrancheClaimed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'TrancheClaimed',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'TrancheClaimed'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"TrancheFailed"`.
 */
export function useCryptoVcTrancheFailedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'TrancheFailed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'TrancheFailed',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'TrancheFailed'>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link cryptoVcABI}__ and `eventName` set to `"TrancheRequested"`.
 */
export function useCryptoVcTrancheRequestedEvent(
  config: Omit<
    UseContractEventConfig<typeof cryptoVcABI, 'TrancheRequested'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: cryptoVcABI,
    eventName: 'TrancheRequested',
    ...config,
  } as UseContractEventConfig<typeof cryptoVcABI, 'TrancheRequested'>);
}
