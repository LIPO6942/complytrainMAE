'use server';
/**
 * @fileOverview Flow to handle sending notifications when a course is updated.
 *
 * - notifyUsersOfCourseUpdate - A function that simulates sending an email notification to users.
 * - CourseUpdateNotificationInput - The input type for the notification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CourseUpdateNotificationInputSchema = z.object({
  courseId: z.string().describe('The ID of the course that was updated.'),
  courseTitle: z.string().describe('The title of the course.'),
  userIds: z.array(z.string()).describe('A list of user IDs to notify.'),
});
export type CourseUpdateNotificationInput = z.infer<typeof CourseUpdateNotificationInputSchema>;

export async function notifyUsersOfCourseUpdate(
  input: CourseUpdateNotificationInput
): Promise<void> {
  return courseUpdateNotificationFlow(input);
}

/**
 * This flow simulates sending an email notification.
 * In a real-world scenario, you would integrate an email service like SendGrid or Mailgun here.
 */
const courseUpdateNotificationFlow = ai.defineFlow(
  {
    name: 'courseUpdateNotificationFlow',
    inputSchema: CourseUpdateNotificationInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    console.log('--- NOTIFICATION SIMULATION ---');
    console.log(`Course "${input.courseTitle}" (ID: ${input.courseId}) has been updated.`);
    console.log(`Simulating sending email to ${input.userIds.length} users:`);
    input.userIds.forEach(userId => {
        console.log(`  - Notifying user: ${userId}`);
    });
    console.log('-----------------------------');

    // In a real implementation, you would replace the logs above with a call
    // to an email service provider. For example:
    //
    // await sendEmail({
    //   to: emails, // You would need to fetch user emails based on userIds
    //   subject: `Course Updated: ${input.courseTitle}`,
    //   body: `The course "${input.courseTitle}" has been updated. Check it out!`,
    // });

    return;
  }
);
