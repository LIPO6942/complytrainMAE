
"use client";

import { useRef, useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, SendHorizonal, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askAIComplianceTutor } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialState: {
  message: string | null,
  errors: any | null,
  answer: string | null,
} = {
  message: null,
  errors: null,
  answer: null,
};

const suggestedQuestions = [
    { key: 'kyc', text: "Expliquez-moi le processus KYC pour un nouveau client." },
    { key: 'aml', text: "Que faire en cas de soupçon de blanchiment d'argent ?" },
    { key: 'ppe', text: "Qu'est-ce qu'une Personne Politiquement Exposée (PPE) ?" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-disabled={pending} disabled={pending}>
      <SendHorizonal className="h-4 w-4" />
    </Button>
  );
}

function SuggestedQuestionButton({ question, isPending }: { question: string, isPending: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" variant="outline" size="sm" disabled={isPending || pending}>
            {question}
        </Button>
    )
}

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction, isPending] = useActionState(askAIComplianceTutor, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleFormAction = async (formData: FormData) => {
    const question = formData.get('question') as string;
    if (question.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: question }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  useEffect(() => {
    if (state.answer && messages[messages.length - 1]?.role !== 'assistant') {
       setMessages((prev) => [...prev, { role: 'assistant', content: state.answer as string }]);
    }
  }, [state.answer, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // This is a bit of a hack to scroll to the bottom.
        // A better solution would involve a more robust scroll management.
        setTimeout(() => {
             if(scrollAreaRef.current) {
                scrollAreaRef.current.children[1].scrollTop = scrollAreaRef.current.children[1].scrollHeight;
             }
        }, 100);
    }
  }, [messages, isPending]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          <span>Tuteur IA en Conformité</span>
        </CardTitle>
        <CardDescription>
          Posez n'importe quelle question relative à la conformité.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
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
             {isPending && messages[messages.length - 1]?.role === 'user' && (
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
         <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Ou essayez l'une de ces questions :</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map(q => (
                <form key={q.key} action={handleFormAction}>
                    <input type="hidden" name="question" value={q.text} />
                    <SuggestedQuestionButton question={q.text} isPending={isPending} />
                </form>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form ref={formRef} action={handleFormAction} className="flex w-full items-center space-x-2">
          <Input id="question" name="question" placeholder="Ex: Expliquez le processus KYC..." autoComplete="off" disabled={isPending}/>
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
