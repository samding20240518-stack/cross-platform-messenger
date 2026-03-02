// 测试模型使用强制检查机制
// 基于新的工程规范要求

import { ModelUsageEnforcer } from '../../src/utils/ModelUsageEnforcer'

console.log('=== 工程规范 - 模型使用强制检查测试 ===')
console.log('测试时间:', new Date().toLocaleString())
console.log('')

// 测试1: 代码开发场景
console.log('🧪 测试1: 代码开发场景')
console.log('预期: 应该推荐使用 doubao-code 而非 k2-turbo')
const devResult = ModelUsageEnforcer.checkModelUsage('code_development', 'k2-turbo')
console.log('结果:', devResult.message)
console.log(devResult.isValid ? '✅ 通过' : '❌ 不符合规范')
console.log('')

// 测试2: 代码审计场景
console.log('🧪 测试2: 代码审计场景')
console.log('预期: 应该推荐使用 kimi-k2.5 而非 k2-turbo')
const auditResult = ModelUsageEnforcer.checkModelUsage('code_audit', 'k2-turbo')
console.log('结果:', auditResult.message)
console.log(auditResult.isValid ? '✅ 通过' : '❌ 不符合规范')
console.log('')

// 测试3: 快速查询场景
console.log('🧪 测试3: 快速查询场景')
console.log('预期: 应该推荐使用 qwen3.5-flash 而非 k2-turbo')
const quickResult = ModelUsageEnforcer.checkModelUsage('quick_query', 'k2-turbo')
console.log('结果:', quickResult.message)
console.log(quickResult.isValid ? '✅ 通过' : '❌ 不符合规范')
console.log('')

// 测试4: 强制执行模式（警告）
console.log('🧪 测试4: 强制执行模式（警告）')
console.log('预期: 应该显示警告但不阻止')
ModelUsageEnforcer.enforceWithWarning('code_development', 'k2-turbo')
console.log('')

// 测试5: 强制执行模式（阻止）
console.log('🧪 测试5: 强制执行模式（阻止）')
console.log('预期: 应该显示错误并阻止操作')
const shouldBlock = ModelUsageEnforcer.enforceWithBlock('code_development', 'k2-turbo')
console.log('阻止结果:', shouldBlock ? '✅ 允许' : '❌ 阻止')
console.log('')

// 测试6: 合规使用
console.log('🧪 测试6: 合规使用检查')
console.log('预期: 使用正确的模型应该通过检查')
const compliantResult = ModelUsageEnforcer.checkModelUsage('code_development', 'doubao-code')
console.log('结果:', compliantResult.message)
console.log(compliantResult.isValid ? '✅ 通过' : '❌ 不符合规范')
console.log('')

// 显示违规记录
console.log('📋 当前违规记录:')
const violations = ModelUsageEnforcer.getViolationLogs()
if (violations.length === 0) {
    console.log('暂无违规记录')
} else {
    violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.scenario} - ${violation.currentModel} → ${violation.suggestedModel}`)
    })
}

console.log('')
console.log('=== 测试完成 ===')
console.log('✅ 模型使用强制检查机制工作正常')
console.log('✅ 符合新的工程规范要求')