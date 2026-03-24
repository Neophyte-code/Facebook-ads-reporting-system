<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;
use app\Models\Client;

class AdInsightAgent implements Agent, Conversational, HasTools
{
    use Promptable;

    //pass the client data
    public function __construct(
        protected Client $client,
        protected array $stats
    ) {}
    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return "You are a Senior Media Buyer for a marketing agency. Analyze the provided ad performance and provide 3 specific, actionable suggestions to improve lead generation and lower costs for a client in the {$this->client->industry} industry.";
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }
}
