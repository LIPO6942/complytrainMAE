"use client";

import { useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, SendHorizonal, User, Zap } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askAIComplianceTutor } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialState = {
  message: null,
  errors: null,
  answer: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-disabled={pending} disabled={pending}>
      <SendHorizonal className="h-4 w-4" />
    </Button>
  );
}

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction] = useActionState(askAIComplianceTutor, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const handleFormAction = async (formData: FormData) => {
    const question = formData.get('question') as string;
    if (question.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: question }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };
  
  if (state.answer && messages[messages.length - 1]?.role !== 'assistant') {
     setMessages((prev) => [...prev, { role: 'assistant', content: state.answer as string }]);
     state.answer = null; // Clear answer to prevent re-adding
  }

  return (
    <Card className="lg:col-span-7 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          <span>AI Compliance Tutor</span>
        </CardTitle>
        <CardDescription>
          Ask any compliance-related question. The AI tutor operates under strict regulatory guidelines.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="h-64 w-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  <p className="text-sm">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><User size={20}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {pending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form ref={formRef} action={handleFormAction} className="flex w-full items-center space-x-2">
          <Input id="question" name="question" placeholder="e.g., Explain the KYC process..." autoComplete="off" />
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
