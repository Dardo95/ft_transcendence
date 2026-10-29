import { Module } from '@nestjs/common';
import { SocketRegistryService } from './socket-registry.service.js';

@Module({
  providers: [SocketRegistryService],
  exports: [SocketRegistryService],
})
export class RealtimeModule {}
