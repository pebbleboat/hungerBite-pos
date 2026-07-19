"use client";

import { useHook } from "@/components/aiChatbot/useHook";
import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import InputField from "@/shared/input/InputField";
import { useEffect, useRef } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

export default function AiChatbot() {
  const {
    isOpen,
    setIsOpen,
    draft,
    setDraft,
    messages,
    sendPrompt,
    handleKeyDown,
    isSendDisabled,
    isSending,
  } = useHook();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      document.getElementById("ai-chat-draft-input")?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="pointer-events-auto flex h-[min(520px,calc(100vh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(15,35,80,0.18)]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-brand-950 px-4 py-3.5 text-white">
            <Text as="p" size="sm" type="bold" className="text-white">
              HungerBite AI
            </Text>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 hover:bg-white/10"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f4f6f8] px-4 py-4"
          >
            {messages.length === 0 ? (
              <Text
                as="p"
                size="sm"
                variant="secondary"
                className="text-center"
              >
                Type a command, e.g. &quot;Create an outlet named Gulati in
                Delhi&quot;
              </Text>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      message.role === "user"
                        ? "rounded-br-md bg-brand-950 text-white"
                        : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
                    }`}
                  >
                    <Text
                      as="p"
                      size="sm"
                      className={`leading-relaxed whitespace-pre-wrap ${
                        message.role === "user" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {message.content}
                    </Text>
                  </div>
                </div>
              ))
            )}
            {isSending ? (
              <Text as="p" size="sm" variant="secondary">
                Thinking...
              </Text>
            ) : null}
          </div>

          <div className="border-t border-gray-100 bg-white p-3">
            <div className="flex items-center gap-2">
              <InputField
                id="ai-chat-draft-input"
                name="aiChatDraft"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='e.g. "Create an outlet named Gulati in Delhi"'
                wrapperClass="w-full"
              />
              <Button
                type="button"
                btnName="Send"
                size="sm"
                icon={<FiSend className="h-4 w-4" />}
                onClick={sendPrompt}
                disabled={isSendDisabled}
              />
            </div>
          </div>
        </div>
      ) : null}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        icon={
          isOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMessageCircle className="h-6 w-6" />
          )
        }
        className="rounded-full! h-14! w-14! z-50"
      />
    </div>
  );
}
