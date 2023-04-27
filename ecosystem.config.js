module.exports = {
    apps : [
      {
        name: 'movie',
        script: './dist/apps/movie/main.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'comment',
        script: './dist/apps/comment/main.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
      },
      {
        name: 'info',
        script: './dist/apps/info/main.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
      },
      {
        name: 'parser',
        script: './dist/apps/parser/main.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
      },
      {
        name: 'person',
        script: './dist/apps/person/main.js',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
      },
    ]
};