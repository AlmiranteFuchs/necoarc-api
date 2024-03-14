export interface BotBehaviour {
    current_step: BotStep, // Current step
    unknown_response: string,
    reset_timeout:number
}

export interface BotStep {
    trigger_answer: string,
    response: string,
    next_steps: BotStep[] | false
}