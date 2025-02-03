/* eslint-disable react/no-unescaped-entities */
"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    BarChart4,
    CheckCircle2,
    Clock,
    DownloadIcon,
    ExternalLink,
    Globe,
    LinkIcon,
    Lock,
    LucideLoader,
    Shield,
    TrendingUp,
    Wallet,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Container from '../components/global/container';

interface ChatBubbleProps {
    content: React.ReactNode;
    isUser?: boolean;
    embedded?: boolean;
}

interface ProcessingStepProps {
    message: string;
    index: number;
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

const StatusBadge = ({ status }: { status: 'success' | 'pending' | 'info' }) => {
    const colors = {
        success: 'bg-green-500/20 text-green-500',
        pending: 'bg-yellow-500/20 text-yellow-500',
        info: 'bg-blue-500/20 text-blue-500'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
            {status.toUpperCase()}
        </span>
    );
};

const ChatBubble = ({ content, isUser = false, embedded = false }: ChatBubbleProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} ${embedded ? 'w-full' : ''}`}
    >
        {!isUser && (
            <Image src="/icons/logo.svg" alt="logo" className="w-6 h-6 rotate-12 flex-shrink-0" width={24} height={24} />
        )}
        <div className={`rounded-xl p-4 ${embedded ? 'w-full' : 'max-w-[80%]'}
      ${isUser ? 'bg-blue-500/10 text-white' : 'bg-gray-800/80 backdrop-blur-sm'}`}>
            {content}
        </div>
    </motion.div>
);

const WalletCard = () => (
    <div className="rounded-2xl bg-background/40 relative border border-border/50 min-h-[300px]">
        <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-8 w-full overflow-hidden h-full"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-xl font-semibold">Twitter Signals</span>
                </div>
                <p className="text-muted-foreground">
                    Track sentiment, identify key influencers, and spot emerging narratives through real-time Twitter analysis. Monitor engagement metrics and uncover hidden alpha.
                </p>
            </div>
        </MagicCard>
    </div>
);

const ProcessingStep = ({ message, index, currentStep, setCurrentStep }: ProcessingStepProps) => {
    const [status, setStatus] = useState('waiting');

    useEffect(() => {
        if (currentStep === index) {
            setStatus('pending');
            const timer = setTimeout(() => {
                setStatus('success');
                setCurrentStep(index + 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, index, setCurrentStep]);

    if (status === 'waiting' && currentStep < index) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 text-sm py-2 items-start"
        >
            {status === 'pending' && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <LucideLoader className="w-4 h-4 text-yellow-500" />
                </motion.div>
            )}
            {status === 'success' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-green-500 mt-2"
                />
            )}
            <span className="text-muted-foreground">{message}</span>
        </motion.div>
    );
};

const TradeProgress = () => (
    <div className="rounded-2xl bg-background/40 relative border border-border/50 min-h-[300px]">
        <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-8 w-full overflow-hidden h-full"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <span className="text-xl font-semibold">Holder Analysis</span>
                </div>
                <p className="text-muted-foreground">
                    Deep dive into wallet behaviors with sophisticated holder metrics. Track average holding times, wallet scores, and win rates of top holders.
                </p>
            </div>
        </MagicCard>
    </div>
);

const TransactionDetails = () => (
    <div className="rounded-2xl bg-background/40 relative border border-border/50 min-h-[300px]">
        <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-8 w-full overflow-hidden h-full"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <BarChart4 className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-xl font-semibold">Bundle Insights</span>
                </div>
                <p className="text-muted-foreground">
                    Monitor bundle percentages and creator analysis in real-time. Track supply distribution and early holder patterns for smarter trading decisions.
                </p>
            </div>
        </MagicCard>
    </div>
);

const ChatHistory = () => (
    <div className="rounded-2xl bg-background/40 relative border border-border/50 min-h-[300px]">
        <MagicCard
            gradientFrom="#38bdf8"
            gradientTo="#3b82f6"
            gradientColor="rgba(59,130,246,0.1)"
            className="p-8 w-full overflow-hidden h-full"
        >
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <Shield className="w-6 h-6 text-yellow-500" />
                    </div>
                    <span className="text-xl font-semibold">Telegram Intel</span>
                </div>
                <p className="text-muted-foreground">
                    Automatically discover and analyze token communities across Telegram. Track portal activity and community engagement for early signals.
                </p>
            </div>
        </MagicCard>
    </div>
);

const Trading = () => (
    <div className="relative flex flex-col items-center justify-center w-full py-20" id="features">
        <Container>
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
                    We've all heard of DeepSeek. <br /> Now, add in <span className="font-subheading italic">sprinkles of crypto.</span>
                </h2>
                <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
                    Buy, sell, and trade your favorite cryptocurrencies with the power of AI research. <br /> Or just use our app to make better decisions. It&apos;s up to you.
                </p>
            </div>
        </Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto pt-10">
            <WalletCard />
            <TradeProgress />
            <TransactionDetails />
            <ChatHistory />
        </div>
    </div>
);

export default Trading;
