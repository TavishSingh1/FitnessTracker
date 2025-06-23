import React from 'react';
import { FaHistory, FaHome, FaPlusCircle, FaHeartbeat } from 'react-icons/fa';

function Sidebar({ currentPage, onNavigate }) {
    const navItems = [
        { name: 'home', label: 'Home', Icon: FaHome },
        { name: 'add-activity', label: 'Add', Icon: FaPlusCircle },
        { name: 'history', label: 'History', Icon: FaHistory },
    ];

    return (
        <aside className="sidebar-menu custom-dark-shadow">
            <div className="sidebar-logo">
                <div className="logo-pulse-icon-link">
                    <FaHeartbeat className="logo-pulse-icon" />
                </div>
            </div>

            <nav className="nav-list">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={`/${item.name}`}
                        className={`nav-item ${currentPage === item.name ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.name);
                        }}
                    >
                        <item.Icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;