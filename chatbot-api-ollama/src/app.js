const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  // ข้อมูลเกี่ยวกับนัฐวัฒ รอดสมบุญ
  const nattawatInfo = `
    ชื่อจริง: นัฐวัฒ รอดสมบุญ
    ชื่อเล่น: นัดวัด
    เกิด: 17 ตุลาคม พ.ศ. 2544
    ชอบกิน: เนื้อ
    ชอบสี: น้ำเงิน, แดง, ฟ้า
    เรียน: ไอที ที่ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
    ทำงาน: software developer
  `;

  try {
    console.log("Sending request to Ollama...");
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3.1",
      messages: [
        {
          role: "system",
          content: `คุณคือ AI แฟนพันธุ์แท้ของนัฐวัฒ รอดสมบุญ ข้อมูลที่คุณรู้มีดังนี้: ${nattawatInfo} และห้ามตอบคำถามที่ไม่เกี่ยวกับนัฐวัฒ รอดสมบุญ`,
        },
        { role: "user", content: message },
      ],
    });

    // รวบรวมข้อความทั้งหมดจาก response
    let fullResponse = "";
    const responseLines = response.data
      .split("\n")
      .filter((line) => line.trim());

    for (const line of responseLines) {
      const data = JSON.parse(line);
      if (data.message?.content) {
        fullResponse += data.message.content;
      }
    }

    console.log("Full response:", fullResponse);
    res.json({ reply: fullResponse });
  } catch (error) {
    console.error("Ollama error:", error);
    res.status(500).json({
      error: "Error interacting with the model",
      details: error.response?.data?.error || error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
