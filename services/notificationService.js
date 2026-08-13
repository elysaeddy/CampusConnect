import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotifications() {

  if (Device.isDevice) {

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {

      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission denied.");
      return;
    }

  }

}

export async function scheduleEventReminder(
    title,
    eventDate
) {

    const event = new Date(eventDate);

    const reminder = new Date(event);

    reminder.setDate(reminder.getDate() - 1);

    await Notifications.scheduleNotificationAsync({

        content: {

            title: "📢 Event Reminder",

            body: `${title} is happening tomorrow!`,

        },

        trigger: reminder,

    });

}