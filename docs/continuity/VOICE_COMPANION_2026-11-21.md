# Local voice companion — November 21, 2026

Roger authorized a conversational voice companion that passes spoken commands to an explicitly selected normal ChatGPT conversation and relays concise replies. The PC provides microphone/playback; Apple Silicon handles local speech recognition,summarization and synthesis. This does not reopen retired production generators/personas or grant new general device roles.

## Implemented and verified

Dedicated isolated Ollama0.40.17 with official release digest verification;Phonon31M English speech,Qwen3.5 4B sentence selection,and MLX Whisper large-v3-turbo recognition. The installed speech checkpoint exposes its default voice;alternative voice claims require actual model capability evidence. Six-second speech generated in3.61seconds;synthetic speech round-trip transcription3.53seconds recovered the intended line with ChatGPT spelling variation. A9.84-second summary took6.11seconds and retained held/not-deliverable/no-extra-credit facts. These are commissioning measurements,not live human microphone acceptance or a latency guarantee.

Existing browser bridge staged at0.6.42 with no additional manifest permissions. Explicit selected existing conversation binding,actual client/tab/URL checks,ignore historical replies,wait for completed stable replies,preserve existing composer drafts,one-send journal and no automatic command replay. Disconnect/restart does not silently resume monitoring. Local speech stop invalidates late pending speech. Browser-alarm wakeups supplement foreground polling;background/sleep/session limitations still apply.

Summarization selects actual source sentences and retains blocker/uncertainty/cost sentences. It does not rewrite an unfinished task as completed. Long/unsupported replies can require the written response. Push-to-talk and opt-in wake-word listening are implemented;microphone defaults off. No continuous human barge-in/real microphone acceptance is claimed before live testing.

## Verification and holds

14backend tests+5new extension fixture tests+50existing browser-relay regression tests pass. Actual loopback UI works;unauthenticated binding and cross-origin requests return403. Browser sample request produced a local speech-ready result;no ChatGPT command was sent. No Flow/Suno/API generation charges used. Selected live ChatGPT send/reply/voice loop and microphone are NOT YET ACCEPTED. Ongoing-access action-time permission is pending;do not claim an operational unattended assistant or bypass that gate. Microphone activation is a separate visible user control.

Protected authority:`psyche/voice-companion-2026-11-21`. Dated private recovery package:`voice-companion-20261121`. Next:after owner confirms the specific ongoing-access step,reload existing Psyche extension,connect the chosen existing chat,test one bounded message through the real composer and completed reply,then test microphone and playback. No other chats,approval buttons or arbitrary tools may be controlled by this relay.
