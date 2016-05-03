const assert = require('assert');

module.exports = {
    checkConfig: checkConfig
};

function checkConfig(config) {
    assert(config && (typeof config == 'object' || typeof config == 'string'),
        'configuration assert: string or config object is required to connect to postgres');

    if(typeof config == 'string')
        config = {connectionString: config};
    else {
        assert(config.database && config.user && 'password' in config,
            'configuration assert: not enough database settings to connect to PostgreSQL');

        config.host = config.host || '127.0.0.1';
        config.port = config.port || 5432;
    }

    if(config.schema){
        assert(typeof config.schema == 'string', 'configuration assert: schema must be a string');
        assert(config.schema.length < 20, 'configuration assert: schema should be between 1 and 20 characters');
        assert(!/\W/.test(config.schema), `configuration assert: ${config.schema} cannot be used as a schema. Only alphanumeric characters and underscores are allowed`);
    }

    if('newJobCheckIntervalSeconds' in config)
        assert(config.newJobCheckIntervalSeconds >=1, 'configuration assert: newJobCheckIntervalSeconds must be at least every second');

    if('expireCheckIntervalSeconds' in config)
        assert(config.expireCheckIntervalSeconds >=1, 'configuration assert: expireCheckIntervalSeconds must be at least every second');

    if('expireCheckIntervalMinutes' in config)
        assert(config.expireCheckIntervalMinutes >=1, 'configuration assert: expireCheckIntervalMinutes must be at least every minute');

    if('archiveCheckIntervalMinutes' in config)
        assert(config.archiveCheckIntervalMinutes >=1, 'configuration assert: archiveCheckIntervalMinutes must be at least every minute');

    if('archiveCompletedJobsEvery' in config)
        assert(typeof config.archiveCompletedJobsEvery == 'string', 'configuration assert: archiveCompletedJobsEvery should be a readable PostgreSQL interval such as "1 day"');

    if('uuid' in config)
        assert(config.uuid == 'v1' || config.uuid == 'v4', 'configuration assert: uuid option only supports v1 or v4');


    config.uuid = config.uuid || 'v1';
    config.schema = config.schema || 'pgboss';

    config.newJobCheckIntervalSeconds = config.newJobCheckIntervalSeconds || 1;
    config.archiveCheckIntervalMinutes = config.archiveCheckIntervalMinutes || 60;
    config.archiveCompletedJobsEvery = config.archiveCompletedJobsEvery || '1 day';

    if('expireCheckIntervalMinutes' in config){
        config.expireCheckIntervalSeconds = config.expireCheckIntervalMinutes * 60;
    } else {
        config.expireCheckIntervalSeconds = config.expireCheckIntervalSeconds || 60;
    }

    return config;
}