<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    public function getMessages(Request $request): JsonResponse
    {
        $channel = $request->query('channel', 'general');

        $messages = Message::where('channel', $channel)
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'channel' => 'string|max:50|nullable',
        ]);

        $message = Message::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'channel' => $request->channel ?? 'general',
        ]);

        $message->load('user:id,name');

        // Broadcast the message
        broadcast(new MessageSent($message));

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    public function getOnlineUsers(): JsonResponse
    {
        // Get all users who have been active recently (last 24 hours)
        // This is a simple approximation of "online" users
        $users = User::select('id', 'name', 'email', 'updated_at')
            ->where('id', '!=', auth()->id())
            ->where('updated_at', '>=', now()->subHours(24))
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'last_seen' => $user->updated_at->diffForHumans(),
                    'is_recent' => $user->updated_at->isAfter(now()->subHours(1)),
                ];
            });

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }
}
