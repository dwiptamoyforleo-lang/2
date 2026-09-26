export interface LeoProgram {
  id: string;
  name: string;
  programId: string;
  description: string;
  code: string;
  transitions: TransitionDef[];
}

export interface TransitionDef {
  name: string;
  inputs: TransitionInput[];
  description: string;
  estimatedConstraints: number;
}

export interface TransitionInput {
  name: string;
  type: string;
  defaultValue: string;
  description?: string;
}

export interface LeoRecord {
  id: string;
  owner: string;
  gates: number;
  data: Record<string, string | number | boolean>;
  programId: string;
  recordName: string;
  spent?: boolean;
}

export interface ExecutionTrace {
  timestamp: string;
  transitionName: string;
  caller: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  createdRecords: LeoRecord[];
  spentRecords: string[];
  proof: {
    circuitConstraints: number;
    witnessCount: number;
    provingTimeMs: number;
    proofDigest: string;
    verified: boolean;
  };
  gasCost: number;
}
