import {createClient, RedisClientType} from 'redis';
import {config} from "../../config";

class RedisConn {
  private client: RedisClientType;
  private connected: boolean;

  /**
   * RedisConn()
   * create redis client, but not connect
   */
  constructor() {
    this.connected = false;
    this.client = createClient(config.redis);
    this.client.on('error', err => {
        console.error('Redis Client Error', err);
        this.connected = false;
      }
    );
  }

  /**
   * async connectRedis()
   * connect to redis. If got error, set isConnected false
   */
  async connectRedis() {
    console.log(await this.client.connect());
    this.connected = true;
  }

  /**
   * appendByKey
   * insert value in redis set by key. Return true, if success
   * @param key key of set
   * @param value new value
   */
  async appendByKey(key: string, value: string) {
    if (!this.isConnected) {
      return false;
    }
    return (await this.client.sAdd(key, value) === 1);
  }

  /**
   * return set values
   * @param key key of set
   */
  async getAllMembers(key: string) {
    return await this.client.sMembers(key);
  }

  /**
   * return true, if redis client are connected;
   */
  get isConnected() {
    return this.connected;
  }
}

const connection = new RedisConn();

export default async function getRedisClient() {
  if (!connection.isConnected) {
    await connection.connectRedis();
  }
  return connection;
}

