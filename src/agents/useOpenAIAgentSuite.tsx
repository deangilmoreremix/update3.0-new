import React from "react";
import OpenAI from "openai";





import { composioAuth, sendEmailViaComposio } from "../services/composioService";

import { useApiStore } from "../store/apiStore";

// Function to get OpenAI client with API key from store
function getOpenAIClient() {
  const apiKeys = useApiStore.getState().apiKeys;
  const openaiKey = apiKeys?.openai;
  
  if (!openaiKey) {
    throw new Error("OpenAI API key is not configured. Please set it in the settings.");
  }
  
  return new OpenAI({ apiKey: openaiKey });
}

export const composioApps = [
  "gmail", "slack", "google_calendar", "zoom", "trello", "google_sheets",
  "shopify", "stripe", "calendly", "whatsapp_business", "twilio",
  "facebook_ads", "typeform"
];

export const composioAuthMap = Object.fromEntries(
  composioApps.map(app => [
    `connect${app.replace(/(^|_)(\w)/g, (_, p1, p2) => p2.toUpperCase())}OAuth`,
    async () => {
      try {
        await composioAuth(app);
        console.log(`${app} connected via Composio.`);
      } catch (err) {
        console.error(`Composio ${app} Auth failed:`, err);
      }
    }
  ])
);

export const composioToolPickerOptions = composioApps.map(app => ({
  label: app.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  value: `composio:${app}`
}));

export function getComposioToolPickerUI(onSelect: (value: string) => void) {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {composioToolPickerOptions.map(option => (
        <button
          key={option.value}
          className="border rounded-xl py-2 px-4 text-sm hover:bg-gray-100"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export async function getComposioToolset(actions: string[] | null = null, app: string | null = null) {
  const { OpenAIToolSet } = await import("composio-core");
  const toolset = new OpenAIToolSet();
  const tools = actions
    ? await toolset.getTools({ actions })
    : app
    ? await toolset.getTools({ app })
    : [];
  return { toolset, tools };
}

export async function handleComposioExecution(response: unknown, toolset: unknown) {
  const responseMessage = response.choices[0].message;
  if (responseMessage.tool_calls) {
    console.log("LLM requested tool use. Executing via Composio...");
    const executionResult = await toolset.handleToolCall(response);
    console.log("Execution Result from Composio:", executionResult);
    embedAgentResponseUI(responseMessage.tool_calls, executionResult);
    return executionResult;
  } else {
    console.log("LLM responded directly:", responseMessage.content);
    embedAgentResponseUI(null, responseMessage.content);
    return responseMessage.content;
  }
}

export async function executeAgentWithTools(agentName: string, task: string, actionsOrApp: string[] | string) {
  const openai = getOpenAIClient();
  const isActionArray = Array.isArray(actionsOrApp);
  const { toolset, tools } = await getComposioToolset(
    isActionArray ? actionsOrApp : null,
    isActionArray ? null : actionsOrApp
  );
  if (!tools || tools.length === 0) {
    console.warn(`No tools found for agent: ${agentName}`);
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: task }],
    tools: tools,
    tool_choice: "auto"
  });
  return await handleComposioExecution(response, toolset);
}

export const runAllAgents = async (task: string, actionsOrApp: string[] | string) => {
  const agents = [
    "AI SDR Agent", "AI Dialer Agent", "AI AE Agent", "AI Journeys Agent", "Voice Agent", "Meetings Agent",
    "Objection Handler Agent", "Reengagement Agent", "Follow-up Agent", "Lead Scoring Agent",
    "Lead Enrichment Agent", "Smart Demo Bot Agent", "WhatsApp Nurturer Agent", "SMS Campaigner Agent",
    "Cold Outreach Closer Agent", "Personalized Email Agent"
  ];

  for (const agent of agents) {
    console.log(`\nRunning ${agent} with tools...`);
    await executeAgentWithTools(agent, task, actionsOrApp);
  }
};

export async function runAgentForModule(agentName: string, task: string, app: string) {
  console.log(`\n[CRM UI Trigger] ${agentName} for task:`, task);
  return await executeAgentWithTools(agentName, task, app);
}

export function addAgentToolButtons(modules: string[], triggerHandler: (agentName: string, task: string, app: string) => void) {
  modules.forEach(module => {
    const container = document.querySelector(`#${module}-agent-tools`);
    if (!container) return;
    composioToolPickerOptions.forEach(option => {
      const button = document.createElement("button");
      button.className = "bg-blue-500 text-white px-3 py-1 rounded text-xs m-1 hover:bg-blue-600";
      button.innerText = option.label;
      button.onclick = () => triggerHandler(`${module} Agent`, `Run ${option.label} tasks`, option.value);
      container.appendChild(button);
    });
  });
}

export function wireAgentsIntoSmartCRM() {
  const smartModules = ["contacts", "deals", "tasks", "calendar", "campaigns"];
  addAgentToolButtons(smartModules, runAgentForModule);
}

// Enhanced function to better format different types of agent responses
function embedAgentResponseUI(toolsUsed: unknown, output: unknown) {
  const container = document.querySelector("#agent-response-container");
  if (!container) return;
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "border border-gray-300 rounded-lg p-4 bg-white shadow-sm";

  const title = document.createElement("h3");
  title.innerText = toolsUsed ? "Agent Tool Result" : "Agent Response";
  title.className = "text-lg font-semibold mb-3 text-indigo-700 flex items-center";
  
  // Add an icon to the title
  const titleIcon = document.createElement("span");
  titleIcon.className = "mr-2 p-1 bg-indigo-100 rounded-full text-indigo-600";
  titleIcon.innerHTML = toolsUsed 
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M8 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/><path d="M15 9 9 15"/><path d="m9 9 6 6"/></svg>';
  title.prepend(titleIcon);

  let content;
  
  // Check if the output is a stringified JSON or an object
  if (typeof output === 'string') {
    try {
      // Try to parse the string as JSON
      const jsonData = JSON.parse(output);
      content = createStructuredOutput(jsonData);
    } catch (e) {
      // If parsing fails, it's regular text - check for email format
      if (output.includes('Subject:') && (output.includes('Dear') || output.includes('Hi') || output.includes('Hello'))) {
        content = createEmailOutput(output);
      } else if (output.includes('#') || output.includes('*')) {
        // Might be markdown, try to render it
        content = createMarkdownOutput(output);
      } else {
        // Regular text
        content = document.createElement("div");
        content.className = "text-sm whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg border border-gray-100";
        content.innerText = output;
      }
    }
  } else if (typeof output === 'object') {
    // It's already an object
    content = createStructuredOutput(output);
  } else {
    // Fallback for other types
    content = document.createElement("div");
    content.className = "text-sm whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg border border-gray-100";
    content.innerText = String(output);
  }

  // Create button row with enhanced styling
  const buttonRow = document.createElement("div");
  buttonRow.className = "mt-4 flex gap-2";

  const copyBtn = document.createElement("button");
  copyBtn.className = "bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-gray-700 text-sm font-medium transition-colors flex items-center";
  copyBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
  copyBtn.onclick = () => {
    const textToCopy = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(textToCopy);
    copyBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
    }, 2000);
  };

  const exportBtn = document.createElement("button");
  exportBtn.className = "bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md text-blue-700 text-sm font-medium transition-colors flex items-center";
  exportBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export';
  exportBtn.onclick = () => {
    const blob = new Blob([typeof output === 'string' ? output : JSON.stringify(output, null, 2)], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "agent-response.txt";
    link.click();
  };

  const emailBtn = document.createElement("button");
  emailBtn.className = "bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-md text-indigo-700 text-sm font-medium transition-colors flex items-center";
  emailBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email';
  emailBtn.onclick = async () => {
    await sendEmailViaComposio({ subject: "Agent Response", body: typeof output === 'string' ? output : JSON.stringify(output, null, 2) });
    emailBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Sent!';
    setTimeout(() => {
      emailBtn.innerHTML = '<svg class="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email';
    }, 2000);
    
    alert("Email sent via Composio");
  };

  buttonRow.appendChild(copyBtn);
  buttonRow.appendChild(exportBtn);
  buttonRow.appendChild(emailBtn);

  card.appendChild(title);
  card.appendChild(content);
  card.appendChild(buttonRow);
  container.appendChild(card);
}

// Helper function to create a structured output for JSON data
function createStructuredOutput(data: unknown) {
  const container = document.createElement("div");
  container.className = "bg-gray-50 p-4 rounded-lg border border-gray-100";
  
  // Check if it's an email sequence (has first_email/follow_up pattern)
  if (data.first_email || data.follow_up || data.final_bump) {
    return createEmailSequenceOutput(data);
  }
  
  // Check if it's a lead enrichment result
  if (data.enrichedProfile || data.potentialPainPoints) {
    return createLeadEnrichmentOutput(data);
  }
  
  // Check if it's a proposal
  if (data.title && data.executiveSummary && data.pricing) {
    return createProposalOutput(data);
  }
  
  // Default structured data display
  for (const [key, value] of Object.entries(data)) {
    const section = document.createElement("div");
    section.className = "mb-3";
    
    const title = document.createElement("h4");
    title.className = "text-sm font-semibold text-gray-700 mb-1";
    title.innerText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    
    const content = document.createElement("div");
    
    if (Array.isArray(value)) {
      // It's an array, create a list
      const list = document.createElement("ul");
      list.className = "list-disc pl-5 text-sm text-gray-600";
      
      value.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerText = typeof item === 'string' ? item : JSON.stringify(item);
        list.appendChild(listItem);
      });
      
      content.appendChild(list);
    } else if (typeof value === 'object' && value !== null) {
      // It's a nested object, stringify with indentation
      content.className = "text-sm text-gray-600 whitespace-pre-wrap";
      content.innerText = JSON.stringify(value, null, 2);
    } else {
      // It's a primitive value
      content.className = "text-sm text-gray-600";
      content.innerText = String(value);
    }
    
    section.appendChild(title);
    section.appendChild(content);
    container.appendChild(section);
  }
  
  return container;
}

// Helper function to create an email output
function createEmailOutput(emailText: string) {
  const container = document.createElement("div");
  container.className = "bg-white p-4 rounded-lg border border-gray-200 shadow-sm";
  
  // Extract subject if present
  const subjectMatch = emailText.match(/Subject:(.+?)(\n|$)/);
  if (subjectMatch) {
    const subject = document.createElement("div");
    subject.className = "font-medium text-gray-800 border-b pb-2 mb-3";
    subject.innerText = subjectMatch[1].trim();
    container.appendChild(subject);
  }
  
  // Format the email body with paragraphs
  const bodyContent = document.createElement("div");
  bodyContent.className = "text-sm text-gray-700 whitespace-pre-wrap";
  
  // Clean up the email text by removing the subject line if present
  let emailBody = emailText;
  if (subjectMatch) {
    emailBody = emailBody.replace(subjectMatch[0], '').trim();
  }
  
  bodyContent.innerText = emailBody;
  container.appendChild(bodyContent);
  
  return container;
}

// Helper function to create a markdown-formatted output
function createMarkdownOutput(markdownText: string) {
  const container = document.createElement("div");
  container.className = "bg-white p-4 rounded-lg border border-gray-200 prose prose-sm max-w-none";
  
  // Split by lines and process markdown-like syntax
  const lines = markdownText.split('\n');
  
  let currentElement: HTMLElement | null = null;
  let listType: 'ul' | 'ol' | null = null;
  let listElement: HTMLUListElement | HTMLOListElement | null = null;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Handle headings
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)[0].length;
      const headingText = trimmedLine.replace(/^#+\s+/, '');
      
      const heading = document.createElement(`h${Math.min(level, 6)}`);
      heading.innerText = headingText;
      heading.className = "font-bold mt-3 mb-2"; // Basic styling
      container.appendChild(heading);
      
      currentElement = null;
      if (listElement) {
        container.appendChild(listElement);
        listElement = null;
        listType = null;
      }
    } 
    // Handle unordered lists
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const itemText = trimmedLine.substring(2);
      
      if (listType !== 'ul') {
        if (listElement) {
          container.appendChild(listElement);
        }
        listElement = document.createElement('ul');
        listElement.className = "list-disc pl-5 my-2";
        listType = 'ul';
      }
      
      const listItem = document.createElement('li');
      listItem.innerText = itemText;
      listItem.className = "mb-1";
      listElement.appendChild(listItem);
      
      currentElement = null;
    }
    // Handle ordered lists
    else if (trimmedLine.match(/^\d+\.\s/)) {
      const itemText = trimmedLine.replace(/^\d+\.\s/, '');
      
      if (listType !== 'ol') {
        if (listElement) {
          container.appendChild(listElement);
        }
        listElement = document.createElement('ol');
        listElement.className = "list-decimal pl-5 my-2";
        listType = 'ol';
      }
      
      const listItem = document.createElement('li');
      listItem.innerText = itemText;
      listItem.className = "mb-1";
      listElement.appendChild(listItem);
      
      currentElement = null;
    }
    // Handle empty lines
    else if (trimmedLine === '') {
      if (listElement) {
        container.appendChild(listElement);
        listElement = null;
        listType = null;
      }
      currentElement = null;
    } 
    // Regular text/paragraphs
    else {
      if (listElement) {
        container.appendChild(listElement);
        listElement = null;
        listType = null;
      }
      
      if (!currentElement) {
        currentElement = document.createElement('p');
        currentElement.className = "mb-2 text-gray-700";
        container.appendChild(currentElement);
      } else {
        currentElement.innerHTML += '<br>';
      }
      
      currentElement.innerHTML += trimmedLine;
    }
  });
  
  // Append any remaining list
  if (listElement) {
    container.appendChild(listElement);
  }
  
  return container;
}

// Helper function for email sequence output
function createEmailSequenceOutput(data: unknown) {
  const container = document.createElement("div");
  container.className = "space-y-4";
  
  if (data.first_email) {
    const emailCard = document.createElement("div");
    emailCard.className = "bg-blue-50 p-4 rounded-lg border border-blue-200";
    
    const title = document.createElement("h4");
    title.className = "text-sm font-semibold text-blue-800 mb-2 flex items-center";
    title.innerHTML = '<span class="mr-1.5">📧</span> First-touch Email';
    
    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 whitespace-pre-wrap";
    content.innerText = data.first_email;
    
    emailCard.appendChild(title);
    emailCard.appendChild(content);
    container.appendChild(emailCard);
  }
  
  if (data.follow_up) {
    const emailCard = document.createElement("div");
    emailCard.className = "bg-purple-50 p-4 rounded-lg border border-purple-200";
    
    const title = document.createElement("h4");
    title.className = "text-sm font-semibold text-purple-800 mb-2 flex items-center";
    title.innerHTML = '<span class="mr-1.5">⏱️</span> Follow-up Email';
    
    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 whitespace-pre-wrap";
    content.innerText = data.follow_up;
    
    emailCard.appendChild(title);
    emailCard.appendChild(content);
    container.appendChild(emailCard);
  }
  
  if (data.final_bump) {
    const emailCard = document.createElement("div");
    emailCard.className = "bg-teal-50 p-4 rounded-lg border border-teal-200";
    
    const title = document.createElement("h4");
    title.className = "text-sm font-semibold text-teal-800 mb-2 flex items-center";
    title.innerHTML = '<span class="mr-1.5">🔄</span> Final Bump';
    
    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 whitespace-pre-wrap";
    content.innerText = data.final_bump;
    
    emailCard.appendChild(title);
    emailCard.appendChild(content);
    container.appendChild(emailCard);
  }
  
  return container;
}

// Helper function for lead enrichment output
function createLeadEnrichmentOutput(data: unknown) {
  const container = document.createElement("div");
  container.className = "space-y-4";
  
  if (data.enrichedProfile) {
    const section = document.createElement("div");
    section.className = "bg-blue-50 p-4 rounded-lg border border-blue-100";
    
    const title = document.createElement("h4");
    title.className = "font-semibold text-blue-800 mb-2";
    title.innerText = "Enriched Profile";
    
    const content = document.createElement("div");
    content.className = "text-sm text-gray-700 whitespace-pre-wrap";
    content.innerText = data.enrichedProfile;
    
    section.appendChild(title);
    section.appendChild(content);
    container.appendChild(section);
  }
  
  if (data.potentialPainPoints && Array.isArray(data.potentialPainPoints)) {
    const section = document.createElement("div");
    section.className = "bg-amber-50 p-4 rounded-lg border border-amber-100";
    
    const title = document.createElement("h4");
    title.className = "font-semibold text-amber-800 mb-2";
    title.innerText = "Potential Pain Points";
    
    const list = document.createElement("ul");
    list.className = "list-disc pl-5 space-y-1";
    
    data.potentialPainPoints.forEach((point: string) => {
      const item = document.createElement("li");
      item.className = "text-sm text-gray-700";
      item.innerText = point;
      list.appendChild(item);
    });
    
    section.appendChild(title);
    section.appendChild(list);
    container.appendChild(section);
  }
  
  if (data.recommendedApproach) {
    const section = document.createElement("div");
    section.className = "bg-green-50 p-4 rounded-lg border border-green-100";
    
    const title = document.createElement("h4");
    title.className = "font-semibold text-green-800 mb-2";
    title.innerText = "Recommended Approach";
    
    const content = document.createElement("div");
    content.className = "text-sm text-gray-700";
    content.innerText = data.recommendedApproach;
    
    section.appendChild(title);
    section.appendChild(content);
    container.appendChild(section);
  }
  
  return container;
}

// Helper function for proposal output
function createProposalOutput(data: unknown) {
  const container = document.createElement("div");
  container.className = "space-y-4";
  
  // Title and executive summary
  const header = document.createElement("div");
  header.className = "bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200";
  
  const title = document.createElement("h3");
  title.className = "text-lg font-bold text-gray-900 mb-2";
  title.innerText = data.title || "Proposal";
  
  const summary = document.createElement("div");
  summary.className = "text-sm text-gray-700";
  summary.innerText = data.executiveSummary || "";
  
  header.appendChild(title);
  header.appendChild(summary);
  container.appendChild(header);
  
  // Pricing section if available
  if (data.pricing) {
    const pricingSection = document.createElement("div");
    pricingSection.className = "bg-green-50 p-4 rounded-lg border border-green-100";
    
    const pricingTitle = document.createElement("h4");
    pricingTitle.className = "font-medium text-green-800 mb-2";
    pricingTitle.innerText = "Pricing Details";
    
    const pricingContent = document.createElement("div");
    pricingContent.className = "space-y-2";
    
    // Convert pricing to appropriate format
    if (typeof data.pricing === 'object') {
      const table = document.createElement("table");
      table.className = "min-w-full text-sm";
      
      Object.entries(data.pricing).forEach(([key, value]) => {
        const row = document.createElement("tr");
        
        const keyCell = document.createElement("td");
        keyCell.className = "py-1 font-medium text-gray-700";
        keyCell.innerText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        const valueCell = document.createElement("td");
        valueCell.className = "py-1 text-right text-gray-900 font-medium";
        valueCell.innerText = typeof value === 'number' ? `$${value.toLocaleString()}` : String(value);
        
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        table.appendChild(row);
      });
      
      pricingContent.appendChild(table);
    } else {
      pricingContent.innerText = String(data.pricing);
    }
    
    pricingSection.appendChild(pricingTitle);
    pricingSection.appendChild(pricingContent);
    container.appendChild(pricingSection);
  }
  
  // Add other sections
  if (data.nextSteps && Array.isArray(data.nextSteps)) {
    const section = document.createElement("div");
    section.className = "bg-blue-50 p-4 rounded-lg border border-blue-100";
    
    const sectionTitle = document.createElement("h4");
    sectionTitle.className = "font-medium text-blue-800 mb-2";
    sectionTitle.innerText = "Next Steps";
    
    const list = document.createElement("ol");
    list.className = "list-decimal pl-5 space-y-1 text-sm text-gray-700";
    
    data.nextSteps.forEach((step: string) => {
      const item = document.createElement("li");
      item.innerText = step;
      list.appendChild(item);
    });
    
    section.appendChild(sectionTitle);
    section.appendChild(list);
    container.appendChild(section);
  }
  
  return container;
}

export { embedAgentResponseUI };

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', wireAgentsIntoSmartCRM);
}