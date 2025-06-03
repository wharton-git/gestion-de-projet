import { Bell, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Notifications = () => {
    const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const userNotifications = savedNotifications.filter(n => n.userId === currentUser?.id);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
    }, [currentUser?.id, dropdownOpen]); // Ajout de dropdownOpen comme dépendance

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );

        setNotifications(updatedNotifications);
        setUnreadCount(prev => prev - 1);

        const allNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const updatedAllNotifications = allNotifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            read: true
        }));

        setNotifications(updatedNotifications);
        setUnreadCount(0);

        const allNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const updatedAllNotifications = allNotifications.map(notification =>
            notification.userId === currentUser?.id ? { ...notification, read: true } : notification
        );
        localStorage.setItem('notifications', JSON.stringify(updatedAllNotifications));
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <div className="indicator">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="badge badge-xs badge-primary indicator-item">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {dropdownOpen && (
                <div
                    className="mt-3 z-[1] card card-compact dropdown-content w-72 bg-base-100 shadow border border-base-300"
                    onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors du clic à l'intérieur
                >
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    className="btn btn-xs"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-4">No notifications</div>
                            ) : (
                                notifications
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-2 mb-1 rounded ${!notification.read ? 'bg-base-200' : ''}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <p>{notification.message}</p>
                                                {!notification.read && (
                                                    <button
                                                        className="btn btn-xs btn-ghost"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notification.id);
                                                        }}
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="text-xs opacity-50 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;