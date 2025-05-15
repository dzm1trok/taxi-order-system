import { testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await testConnection();
        return NextResponse.json({ message: 'Database connection test completed' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to test database connection' },
            { status: 500 }
        );
    }
} 