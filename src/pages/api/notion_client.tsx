import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env.mjs";
const notion = new Client({ auth: env.NOTION_KEY });

const databaseId = env.NOTION_DATABASE_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { title, content } = req.body as { title: string; content: string };

      const response = await notion.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
        ],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong", error });
    }
  } else {
  }
};
