import requests
import json

# Test game functionality with fresh tokens
BASE_URL = "https://quickwin-hub.preview.emergentagent.com/api"

def test_game_functionality():
    print("Testing game functionality...")
    
    # 1. Register a new user
    user_data = {
        "email": "gametest@wingo.com",
        "password": "TestPass123!",
        "name": "Game Test User"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    if response.status_code != 200:
        print(f"❌ User registration failed: {response.status_code}")
        return False
    
    user_token = response.json()['token']
    print("✅ User registered successfully")
    
    # 2. Login admin
    admin_data = {
        "email": "admin@wingo.com", 
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=admin_data)
    if response.status_code != 200:
        print(f"❌ Admin login failed: {response.status_code}")
        return False
    
    admin_token = response.json()['token']
    print("✅ Admin logged in successfully")
    
    # 3. Create and approve a deposit to give user balance
    deposit_data = {
        "utr": "123456789012",
        "amount": 1000
    }
    
    headers = {'Authorization': f'Bearer {user_token}', 'Content-Type': 'application/json'}
    response = requests.post(f"{BASE_URL}/deposit/request", json=deposit_data, headers=headers)
    if response.status_code != 200:
        print(f"❌ Deposit request failed: {response.status_code}")
        return False
    
    deposit_id = response.json()['deposit']['id']
    print("✅ Deposit request created")
    
    # 4. Approve deposit as admin
    admin_headers = {'Authorization': f'Bearer {admin_token}', 'Content-Type': 'application/json'}
    response = requests.put(f"{BASE_URL}/admin/deposit/{deposit_id}/approve", headers=admin_headers)
    if response.status_code != 200:
        print(f"❌ Deposit approval failed: {response.status_code}")
        return False
    
    print("✅ Deposit approved")
    
    # 5. Check user balance
    response = requests.get(f"{BASE_URL}/user/balance", headers=headers)
    if response.status_code != 200:
        print(f"❌ Balance check failed: {response.status_code}")
        return False
    
    balance = response.json()['balance']
    print(f"✅ User balance: ₹{balance}")
    
    # 6. Test game bets
    print("\n🎮 Testing game bets...")
    wins = 0
    losses = 0
    
    for i in range(10):
        bet_data = {
            "game_mode": "30s",
            "bet_type": "number", 
            "bet_value": "0",  # Should win ~20% of time
            "bet_amount": 10
        }
        
        response = requests.post(f"{BASE_URL}/game/bet", json=bet_data, headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result['win_amount'] > 0:
                wins += 1
                print(f"  Bet {i+1}: WIN - Number: {result['result_number']}, Color: {result['result_color']}, Won: ₹{result['win_amount']}")
            else:
                losses += 1
                print(f"  Bet {i+1}: LOSS - Number: {result['result_number']}, Color: {result['result_color']}")
        else:
            print(f"  Bet {i+1}: FAILED - Status: {response.status_code}")
            break
    
    total_bets = wins + losses
    if total_bets > 0:
        win_rate = (wins / total_bets) * 100
        print(f"\n📊 Game Results: {wins} wins, {losses} losses")
        print(f"📊 Win Rate: {win_rate:.1f}%")
        
        # Check if win rate is reasonable (should be around 20% but allow variance)
        if 0 <= win_rate <= 50:  # Allow wide range for small sample
            print("✅ Game logic appears to be working")
            return True
        else:
            print("❌ Win rate seems unusual")
            return False
    else:
        print("❌ No successful bets")
        return False

if __name__ == "__main__":
    test_game_functionality()