import https from 'https';

/**
 * Sends a message prompt to the OpenAI Chat Completion API.
 * Uses vanilla Node.js https module to avoid external dependencies.
 * 
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @returns {Promise<string>} LLM response text
 */
export function callLLM(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return reject(new Error('OPENAI_API_KEY environment variable is not defined. Please set it to run in AI mode.'));
    }

    const payload = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2
    });

    const options = {
      hostname: 'api.openai.com',
      port: 448,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    // Note: port 443 is standard, let's make sure it is 443
    options.port = 443; 

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          try {
            const parsedError = JSON.parse(data);
            return reject(new Error(`OpenAI API returned error (${res.statusCode}): ${parsedError.error?.message || data}`));
          } catch {
            return reject(new Error(`OpenAI API returned status ${res.statusCode}: ${data}`));
          }
        }

        try {
          const responseBody = JSON.parse(data);
          const text = responseBody.choices?.[0]?.message?.content;
          if (text) {
            resolve(text.trim());
          } else {
            reject(new Error('OpenAI API returned empty choices or unexpected response format.'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse OpenAI API response: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Connection to OpenAI API failed: ${err.message}`));
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Generate a smart code documentation markdown using OpenAI.
 */
export async function generateDocWithAI(fileName, fileContent) {
  const systemPrompt = "You are an expert technical documentation writer. Generate a concise, clear markdown documentation page for the provided source code file. Include tables of classes, methods, and functions with short summaries.";
  const userPrompt = `Generate documentation for file: ${fileName}\n\nCode:\n\`\`\`\n${fileContent}\n\`\`\``;
  return callLLM(systemPrompt, userPrompt);
}

/**
 * Generate unit tests using OpenAI.
 */
export async function generateTestsWithAI(fileName, fileContent) {
  const systemPrompt = "You are an expert QA engineer. Generate a clean, runnable unit test file using Node.js ES Modules. Provide standard mock assertions for each exported function and class method. Return ONLY the code, no markdown wrappers.";
  const userPrompt = `Generate unit tests for file: ${fileName}\n\nCode:\n\`\`\`\n${fileContent}\n\`\`\``;
  const rawCode = await callLLM(systemPrompt, userPrompt);
  
  // Clean potential markdown output wrapper
  return rawCode.replace(/^```javascript\n/, '').replace(/^```js\n/, '').replace(/```$/, '').trim();
}

/**
 * Run code quality review using OpenAI.
 */
export async function reviewCodeWithAI(fileName, fileContent) {
  const systemPrompt = "You are a senior software engineer. Perform a code quality review. Highlight potential issues, code style improvements, and performance bottlenecks. Structure the response clearly as a review report with a list of recommendations.";
  const userPrompt = `Review this file: ${fileName}\n\nCode:\n\`\`\`\n${fileContent}\n\`\`\``;
  return callLLM(systemPrompt, userPrompt);
}
