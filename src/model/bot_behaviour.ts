export class BotBehaviour {
    first_step: BotStep;
    current_step: BotStep; // Current step
    unknown_response: string;
    error_response: string;
    goodbye_message: string;
    reset_timeout: number;

    constructor(first_step: BotStep, unknown_response: string, error_response: string, goodbye_message: string, reset_timeout: number) {
        this.first_step = first_step; this.unknown_response = unknown_response; this.reset_timeout = reset_timeout; this.current_step = first_step;
        this.error_response = error_response; this.goodbye_message = goodbye_message;
    }
}

export interface BotStep {
    trigger_answer: string,
    response: string,
    as_reply: boolean,
    next_steps: BotStep[]
}