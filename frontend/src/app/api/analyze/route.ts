import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractAddress = searchParams.get('contractAddress')
    const ticker = searchParams.get('ticker')

    if (!contractAddress) {
      return new Response(
        JSON.stringify({ error: 'Contract address and ticker are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set')
    }
    let url = `${backendUrl}/analyze?contract_address=${encodeURIComponent(contractAddress)}`
    if (ticker) 
      url += `&ticker=${encodeURIComponent(ticker)}`
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Backend request failed: ${errorData}`)
    }

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        try {
          const text = new TextDecoder().decode(chunk)
          const lines = text.split('\n')
          
          for (const line of lines) {
            if (line.trim()) {
              if (line === 'data: [DONE]') {
                controller.enqueue(`data: ${JSON.stringify({ done: true })}\n\n`)
              } else {
                // Remove 'data: ' prefix if it exists
                const content = line.startsWith('data: ') ? line.slice(6) : line
                controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`)
              }
            }
          }
        } catch (error) {
          console.error('Stream transform error:', error)
          controller.enqueue(`data: ${JSON.stringify({
            error: 'Stream processing failed',
            message: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`)
          controller.terminate()
        }
      },
      flush(controller) {
        controller.terminate()
      }
    })

    const stream = response.body?.pipeThrough(transformStream)
    if (!stream) {
      throw new Error('Failed to create response stream')
    }

    // Add error handler for the stream
    const [streamForResponse, streamForErrorHandling] = stream.tee()
    
    const reader = streamForErrorHandling.getReader()
    reader.read().catch(error => {
      console.error('Stream read error:', error)
    })

    return new Response(streamForResponse, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'