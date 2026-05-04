#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
英文翻译纯度检查脚本
用于检查 en.json 中是否包含中文字符
"""

import json
import re
import sys

def check_english_purity():
    """检查英文翻译文件的纯度"""
    
    print("🔍 检查英文翻译纯度...")
    print("-" * 50)
    
    # 读取 en.json
    try:
        with open('src/i18n/locales/en.json', 'r', encoding='utf-8') as f:
            content = f.read()
            en_data = json.loads(content)
    except FileNotFoundError:
        print("❌ 错误：找不到 src/i18n/locales/en.json")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ 错误：en.json 格式错误 - {e}")
        return False
    
    # 检查中文字符
    chinese_pattern = re.compile(r'[\u4e00-\u9fff]+')
    found_chinese = []
    
    def check_value(obj, path=""):
        """递归检查所有值"""
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_path = f"{path}.{key}" if path else key
                check_value(value, new_path)
        elif isinstance(obj, str):
            matches = chinese_pattern.findall(obj)
            if matches:
                found_chinese.append({
                    'path': path,
                    'value': obj,
                    'chinese': matches
                })
    
    check_value(en_data)
    
    # 输出结果
    if found_chinese:
        print("❌ 发现中文字符：\n")
        for item in found_chinese:
            print(f"路径: {item['path']}")
            print(f"值: {item['value']}")
            print(f"中文: {', '.join(item['chinese'])}")
            print("-" * 50)
        return False
    else:
        print("✅ 英文翻译 100% 纯英文！")
        print("✅ 没有发现任何中文字符")
        return True

def check_json_validity():
    """检查 JSON 文件格式"""
    
    print("\n🔍 检查 JSON 文件格式...")
    print("-" * 50)
    
    files = {
        'zh.json': 'src/i18n/locales/zh.json',
        'en.json': 'src/i18n/locales/en.json'
    }
    
    all_valid = True
    
    for name, path in files.items():
        try:
            with open(path, 'r', encoding='utf-8') as f:
                json.load(f)
            print(f"✅ {name} 格式正确")
        except FileNotFoundError:
            print(f"❌ {name} 文件不存在")
            all_valid = False
        except json.JSONDecodeError as e:
            print(f"❌ {name} 格式错误: {e}")
            all_valid = False
    
    return all_valid

def check_translation_keys():
    """检查中英文翻译键是否一致"""
    
    print("\n🔍 检查翻译键一致性...")
    print("-" * 50)
    
    try:
        with open('src/i18n/locales/zh.json', 'r', encoding='utf-8') as f:
            zh_data = json.load(f)
        with open('src/i18n/locales/en.json', 'r', encoding='utf-8') as f:
            en_data = json.load(f)
    except Exception as e:
        print(f"❌ 读取文件失败: {e}")
        return False
    
    def get_all_keys(obj, prefix=""):
        """获取所有键"""
        keys = set()
        if isinstance(obj, dict):
            for key, value in obj.items():
                full_key = f"{prefix}.{key}" if prefix else key
                keys.add(full_key)
                if isinstance(value, dict):
                    keys.update(get_all_keys(value, full_key))
        return keys
    
    zh_keys = get_all_keys(zh_data)
    en_keys = get_all_keys(en_data)
    
    # 检查缺失的键
    missing_in_en = zh_keys - en_keys
    missing_in_zh = en_keys - zh_keys
    
    if missing_in_en:
        print("⚠️  英文翻译中缺失的键：")
        for key in sorted(missing_in_en):
            print(f"  - {key}")
    
    if missing_in_zh:
        print("⚠️  中文翻译中缺失的键：")
        for key in sorted(missing_in_zh):
            print(f"  - {key}")
    
    if not missing_in_en and not missing_in_zh:
        print("✅ 中英文翻译键完全一致")
        print(f"✅ 共有 {len(zh_keys)} 个翻译键")
        return True
    else:
        return False

def main():
    """主函数"""
    
    print("\n" + "=" * 50)
    print("  英文翻译纯度检查工具")
    print("=" * 50 + "\n")
    
    # 执行所有检查
    purity_ok = check_english_purity()
    json_ok = check_json_validity()
    keys_ok = check_translation_keys()
    
    # 总结
    print("\n" + "=" * 50)
    print("  检查结果总结")
    print("=" * 50)
    
    results = [
        ("英文纯度", purity_ok),
        ("JSON 格式", json_ok),
        ("翻译键一致性", keys_ok)
    ]
    
    for name, result in results:
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{name}: {status}")
    
    all_ok = all(result for _, result in results)
    
    if all_ok:
        print("\n🎉 所有检查通过！")
        return 0
    else:
        print("\n⚠️  部分检查未通过，请修复后重试")
        return 1

if __name__ == '__main__':
    sys.exit(main())
