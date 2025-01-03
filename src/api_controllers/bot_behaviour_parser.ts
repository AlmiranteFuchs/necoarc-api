import * as fs from 'fs';
import * as path from 'path';
import { BotBehaviour, BotStep } from '../model/bot_behaviour';

export function createBotBehaviourFromJson(filePath: string): BotBehaviour {
    // Resolve the path to make it absolute
    const resolvedPath = path.resolve(__dirname, filePath);

    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
    const jsonObject = JSON.parse(fileContent);

    function mapBotStep(jsonStep: any): BotStep {
        return {
            trigger_answer: jsonStep.trigger_answer,
            response: jsonStep.response,
            as_reply: jsonStep.as_reply,
            next_steps: jsonStep.next_steps.map((step: any) => mapBotStep(step))
        };
    }

    const firstStep = mapBotStep(jsonObject.first_step);
    const currentStep = mapBotStep(jsonObject.current_step);

    return new BotBehaviour(
        firstStep,
        jsonObject.unknown_response,
        jsonObject.error_response,
        jsonObject.goodbye_message,
        jsonObject.reset_timeout
    );
}