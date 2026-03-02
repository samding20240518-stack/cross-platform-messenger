#!/bin/bash
# Model Latency Test Script
# 基于工程规范要求，必须实测网络延迟数据

echo "=== 模型网络延迟测试 ==="
echo "测试时间: $(date)"
echo ""

# 测试目标
declare -A MODELS=(
    ["qwen.aliyun.com"]="阿里云 Qwen"
    ["api.volcengine.com"]="字节火山 Doubao"
    ["api.moonshot.cn"]="Moonshot Kimi"
)

# 测试结果存储
declare -A LATENCY_RESULTS

# 执行延迟测试
for host in "${!MODELS[@]}"; do
    echo -n "正在测试 ${MODELS[$host]} (${host})... "
    
    # 使用curl测试TCP连接建立时间
    result=$(curl -o /dev/null -s -w "%{time_connect}" --max-time 2 "https://${host}" 2>/dev/null || echo "timeout")
    
    if [ "$result" = "timeout" ] || [ -z "$result" ]; then
        LATENCY_RESULTS[$host]="超时/失败"
        echo "❌ 超时/失败"
    else
        # 转换为毫秒并保留2位小数
        latency_ms=$(echo "$result * 1000" | bc -l | cut -d. -f1)
        LATENCY_RESULTS[$host]="${latency_ms}ms"
        echo "✅ ${latency_ms}ms"
    fi
done

echo ""
echo "=== 测试结果汇总 ==="
echo "模型服务商 | 延迟时间 | 评级"
echo "-----------|----------|------"

for host in "${!MODELS[@]}"; do
    latency=${LATENCY_RESULTS[$host]}
    provider=${MODELS[$host]}
    
    # 评级逻辑
    if [[ "$latency" =~ ^[0-9]+ms$ ]]; then
        latency_num=${latency%ms}
        if [ "$latency_num" -lt 50 ]; then
            rating="🥇 极快"
        elif [ "$latency_num" -lt 100 ]; then
            rating="🥈 优秀"
        elif [ "$latency_num" -lt 200 ]; then
            rating="🥉 良好"
        else
            rating="⚠️ 一般"
        fi
    else
        rating="❌ 超时"
    fi
    
    printf "%-10s | %-8s | %s\n" "$provider" "$latency" "$rating"
done

# 生成测试报告
cat > model_latency_report.json << EOF
{
  "test_time": "$(date -Iseconds)",
  "results": {
EOF

first=true
for host in "${!MODELS[@]}"; do
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> model_latency_report.json
    fi
    echo "    \"${MODELS[$host]}\": {\"latency\": \"${LATENCY_RESULTS[$host]}\"}" >> model_latency_report.json
done

cat >> model_latency_report.json << EOF
  }
}
EOF

echo ""
echo "✅ 测试报告已生成: model_latency_report.json"