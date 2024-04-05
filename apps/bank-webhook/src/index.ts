import express from 'express';
import db from '@repo/db/client';

const app = express();

app.post('/', async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: 'Success',
        },
      }),
    ]);

    res.status(200).json({
      message: 'captured',
    });
  } catch (error) {
    throw new Error('Error while updating onramp');
  }
});
