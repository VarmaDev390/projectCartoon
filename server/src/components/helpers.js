export async function callGPT(openai, messageArr) {
  console.log("messageArr", messageArr);
  return await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: messageArr,
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.3,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });

  //   for await (const chunk of stream) {
  //     process.stdout.write(chunk.choices[0]?.delta?.content || "");
  //   }
}
