import type { NextApiRequest, NextApiResponse } from 'next';
import { prettyConsoleLog } from 'logging-middleware/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { stack, level, pkg, message } = req.body;
    

    prettyConsoleLog(stack, level, pkg, message);
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
