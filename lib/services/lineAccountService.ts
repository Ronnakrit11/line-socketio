import { PrismaClient } from '@prisma/client';
import { LineAccount, SignatureVerificationResult } from '@/app/types/line';
import { verifyLineSignature } from './lineSignatureService';

const prisma = new PrismaClient();

export async function findLineAccountBySignature(
  body: string,
  signature: string
): Promise<SignatureVerificationResult | null> {
  try {
    // Get all active LINE accounts
    const accounts = await prisma.lineAccount.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        channelSecret: true,
        channelAccessToken: true,
        active: true
      }
    });

    console.log('Active LINE accounts found:', accounts.length);

    // Try each account's channel secret
    for (const account of accounts) {
      console.log('Verifying signature for account:', {
        id: account.id,
        name: account.name
      });

      const isValid = verifyLineSignature(body, signature, account.channelSecret);
      
      if (isValid) {
        console.log('Found matching account:', {
          id: account.id,
          name: account.name
        });
        return { account, isValid: true };
      }
    }

    console.log('No matching account found for signature');
    return null;
  } catch (error) {
    console.error('Error finding LINE account:', error);
    return null;
  }
}

export async function getActiveLineAccounts(): Promise<LineAccount[]> {
  return prisma.lineAccount.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      channelSecret: true,
      channelAccessToken: true,
      active: true
    }
  });
}