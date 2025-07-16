import { leadEnrichmentAgent } from './leadEnrichmentAgent';
import { aiSdrAgent } from './aiSdrAgent';
import { proposalGeneratorAgent } from './proposalGeneratorAgent';
import { personalizedEmailAgent } from './personalizedEmailAgent';
import { leadScoringAgent } from './leadScoringAgent';
import { aiAeAgent } from './aiAeAgent';
import { objectionHandlerAgent } from './objectionHandlerAgent';
import { coldOutreachCloserAgent } from './coldOutreachCloserAgent';
import { smartDemoBotAgent } from './smartDemoBotAgent';
import { followUpAgent } from './followUpAgent';
import { voiceAgent } from './voiceAgent';
import { smsCampaignerAgent } from './smsCampaignerAgent';
import { meetingsAgent } from './meetingsAgent';
import { aiDialerAgent } from './aiDialerAgent';
import { aiJourneysAgent } from './aiJourneysAgent';
import { whatsappNurturerAgent } from './whatsappNurturerAgent';
import { reengagementAgent } from './reengagementAgent';

export async function runAgentWorkflow(agentId: string, input: unknown, setSteps?: (steps: unknown) => void) {
  switch (agentId) {
    // Contact Module Agents
    case "lead-enrichment":
      return await leadEnrichmentAgent(input, setSteps);
    case "ai-sdr":
      return await aiSdrAgent(input, setSteps);
    case "personalized-email":
      return await personalizedEmailAgent(input, setSteps);
    case "lead-scoring":
      return await leadScoringAgent(input, setSteps);
      
    // Deal Module Agents
    case "proposal-generator":
      return await proposalGeneratorAgent(input, setSteps);
    case "ai-ae":
      return await aiAeAgent(input, setSteps);
    case "objection-handler":
      return await objectionHandlerAgent(input, setSteps);
    case "cold-outreach-closer":
      return await coldOutreachCloserAgent(input, setSteps);
    case "smart-demo-bot":
      return await smartDemoBotAgent(input, setSteps);
      
    // Task Module Agents
    case "follow-up":
      return await followUpAgent(input, setSteps);
    case "voice-agent":
      return await voiceAgent(input, setSteps);
    case "sms-campaigner":
      return await smsCampaignerAgent(input, setSteps);
      
    // Calendar Module Agents
    case "meetings-agent":
      return await meetingsAgent(input, setSteps);
    case "ai-dialer":
      return await aiDialerAgent(input, setSteps);
    case "ai-journeys":
      return await aiJourneysAgent(input, setSteps);
      
    // Campaign Module Agents
    case "whatsapp-nurturer":
      return await whatsappNurturerAgent(input, setSteps);
    case "reengagement-agent":
      return await reengagementAgent(input, setSteps);
      
    default:
      throw new Error(`Unknown agent: ${agentId}`);
  }
}