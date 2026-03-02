/**
 * 模型使用强制检查机制
 * 基于工程规范要求，确保场景与模型匹配
 */

export interface ModelUsageRule {
  scenario: string
  requiredModel: string
  alternatives?: string[]
  reason: string
}

export class ModelUsageEnforcer {
  private static rules: ModelUsageRule[] = [
    {
      scenario: 'code_development',
      requiredModel: 'doubao-code',
      alternatives: ['qwen', 'qwen3-coder-next'],
      reason: '代码开发需要低延迟+代码专项优化'
    },
    {
      scenario: 'code_audit',
      requiredModel: 'kimi-k2.5',
      alternatives: ['kimi-thinking'],
      reason: '代码审计需要256K上下文+强推理能力'
    },
    {
      scenario: 'quick_query',
      requiredModel: 'qwen3.5-flash',
      alternatives: ['k2-turbo'],
      reason: '快速查询需要最低延迟'
    }
  ]

  /**
   * 检查模型使用是否符合规范
   */
  static checkModelUsage(scenario: string, currentModel: string): {
    isValid: boolean
    message: string
    suggestedModel?: string
  } {
    const rule = this.rules.find(r => r.scenario === scenario)
    if (!rule) {
      return {
        isValid: true,
        message: '该场景无强制模型要求'
      }
    }

    // 检查是否使用了推荐模型
    if (rule.requiredModel === currentModel) {
      return {
        isValid: true,
        message: `✅ 符合规范：当前使用 ${currentModel} 适用于 ${scenario}`
      }
    }

    // 检查是否使用了备选模型
    if (rule.alternatives?.includes(currentModel)) {
      return {
        isValid: true,
        message: `⚠️ 使用备选模型：${currentModel} 适用于 ${scenario}，推荐：${rule.requiredModel}`
      }
    }

    // 使用了不推荐的模型
    return {
      isValid: false,
      message: `❌ 不符合规范：${currentModel} 不推荐用于 ${scenario}，请使用：${rule.requiredModel}`,
      suggestedModel: rule.requiredModel
    }
  }

  /**
   * 强制执行模型使用规范（警告模式）
   */
  static enforceWithWarning(scenario: string, currentModel: string): void {
    const result = this.checkModelUsage(scenario, currentModel)
    
    if (!result.isValid) {
      console.warn(`[ModelUsageEnforcer] ${result.message}`)
      
      // 记录违规使用日志
      this.logViolation(scenario, currentModel, result.suggestedModel!)
    }
  }

  /**
   * 强制执行模型使用规范（阻止模式）
   */
  static enforceWithBlock(scenario: string, currentModel: string): boolean {
    const result = this.checkModelUsage(scenario, currentModel)
    
    if (!result.isValid) {
      console.error(`[ModelUsageEnforcer] ${result.message}`)
      console.error(`[ModelUsageEnforcer] 操作被阻止，请切换到推荐模型`)
      
      // 记录违规使用日志
      this.logViolation(scenario, currentModel, result.suggestedModel!)
      
      return false  // 阻止操作
    }
    
    return true  // 允许操作
  }

  /**
   * 记录违规使用日志
   */
  private static logViolation(scenario: string, currentModel: string, suggestedModel: string): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      scenario,
      currentModel,
      suggestedModel,
      violationType: 'model_usage_mismatch'
    }
    
    // 在实际应用中，这里应该写入日志文件或发送到日志服务
    console.log('[ModelUsageEnforcer] 违规记录:', JSON.stringify(logEntry, null, 2))
    
    // 保存到localStorage用于分析
    try {
      const violations = JSON.parse(localStorage.getItem('model_usage_violations') || '[]')
      violations.push(logEntry)
      localStorage.setItem('model_usage_violations', JSON.stringify(violations))
    } catch (e) {
      console.error('Failed to save violation log:', e)
    }
  }

  /**
   * 获取所有违规记录
   */
  static getViolationLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('model_usage_violations') || '[]')
    } catch (e) {
      console.error('Failed to load violation logs:', e)
      return []
    }
  }

  /**
   * 清除违规记录
   */
  static clearViolationLogs(): void {
    try {
      localStorage.removeItem('model_usage_violations')
      console.log('[ModelUsageEnforcer] 违规记录已清除')
    } catch (e) {
      console.error('Failed to clear violation logs:', e)
    }
  }
}

// 使用示例
export function checkCurrentModelUsage(scenario: string): void {
  const currentModel = 'k2-turbo'  // 应该从系统配置中获取
  const result = ModelUsageEnforcer.checkModelUsage(scenario, currentModel)
  console.log(result.message)
}