import React from "react";
import { Notification } from "../interfaces";

export default function useNotifications(): [
  Notification[],
  (note: Notification) => void,
  (index: number) => void
] {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  function addNotification(note: Notification) {
    setNotifications([note, ...notifications]);
  }
  function removeNotification(index: number) {
    setNotifications(notifications.filter((note, i) => index !== i));
  }
  return [notifications, addNotification, removeNotification];
}
