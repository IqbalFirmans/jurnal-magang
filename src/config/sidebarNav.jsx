
const sidebarNavItems = [
    {
        id: 'main',
        label: 'Main',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: '/',
                iconClass: 'fas fa-tachometer-alt',
                roles: ['admin', 'teacher', 'student'] // Bisa diakses semua
            },
        ]
    },
    {
        id: 'management',
        label: 'Manajemen Data',
        items: [
            {
                id: 'students',
                label: 'Siswa',
                href: '/students',
                iconClass: 'fas fa-users',
                roles: ['admin', 'teacher'] 
            },
            {
                id: 'teachers',
                label: 'Guru',
                href: '/teachers',
                iconClass: 'fas fa-chalkboard-teacher',
                roles: ['admin']
            },
            {
                id: 'journals',
                label: 'Jurnal',
                href: '/journals',
                iconClass: 'fas fa-book',
                roles: ['admin', 'teacher', 'student'] 
            },
            {
                id: 'settings',
                label: 'Pengaturan',
                href: '/settings',
                iconClass: 'fas fa-cog',
                roles: ['admin'] 
            },
        ]
    },
];

export default sidebarNavItems;