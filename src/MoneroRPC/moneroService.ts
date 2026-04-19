export interface MoneroStats {
  hashrate: number;
  height: number;
  totalSupply: number;
  difficulty: number;
  status: string;
  blockRemaining: number;
  blockWeight: number; // in bytes
}

export class MoneroRPCService {
  // Verified stable public nodes
  private nodes = [
    "https://xmr-node.cakewallet.com:18081",
    "https://node.moneroworld.com:18089",
    "https://nodes.hashvault.pro:443",
    "https://node.supportxmr.com:443",
    "https://lux.node.xmr.pm:18081",
    "https://node.community.monero.host:443"
  ];
  private currentNodeIndex = 0;

  async fetchRPC(method: string, params: any = {}) {
    let lastError: any = null;
    
    for (let i = 0; i < this.nodes.length; i++) {
      const baseUrl = this.nodes[this.currentNodeIndex];
      // Use /json_rpc as it is the most consistent across public nodes for restricted access
      const url = `${baseUrl}/json_rpc`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: '0',
            method: method,
            params: params
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        return data.result;
      } catch (err) {
        lastError = err;
        console.warn(`[MoneroRPC] Node ${baseUrl} failed:`, err instanceof Error ? err.message : String(err));
        this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;
      }
    }

    throw lastError || new Error("All Monero nodes failed");
  }

  async getInfo() {
    return this.fetchRPC("get_info");
  }

  async getBlockCount() {
    return this.fetchRPC("get_block_count");
  }

  async getLastBlockHeader() {
    return this.fetchRPC("get_last_block_header");
  }

  async getSummaryStats(): Promise<MoneroStats> {
    try {
      const info = await this.getInfo();
      
      return {
        hashrate: info.hashrate || 0,
        height: info.height || 0,
        totalSupply: (info.total_emission || 0) / 1e12,
        difficulty: info.difficulty || 0,
        status: info.status || "OK",
        blockRemaining: info.height ? (Math.ceil(info.height / 720) * 720) - info.height : 0,
        blockWeight: info.block_weight_median || 0
      };
    } catch (e) {
      console.error("[MoneroRPC] get_info failed, trying get_block_count fallback");
      const blockCount = await this.getBlockCount();
      const height = blockCount.count || 0;
      return {
        hashrate: 0,
        height: height,
        totalSupply: 0,
        difficulty: 0,
        status: blockCount.status || "PARTIAL",
        blockRemaining: height ? (Math.ceil(height / 720) * 720) - height : 0,
        blockWeight: 0
      };
    }
  }
}
