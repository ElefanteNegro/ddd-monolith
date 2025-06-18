import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['kafka:29092'],
});

const producer = kafka.producer();

async function sendTestMessage() {
  try {
    await producer.connect();
    console.log('Producer connected');

    const message = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      timestamp: new Date().toISOString()
    };

    await producer.send({
      topic: 'domain.user.created',
      messages: [
        { 
          key: message.id,
          value: JSON.stringify(message)
        }
      ]
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

sendTestMessage(); 