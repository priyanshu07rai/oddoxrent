from rest_framework import serializers
from .models import Cart, CartItem, RentalOrder, RentalOrderItem

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_rental_price = serializers.SerializerMethodField()
    total_deposit = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'

    def get_total_rental_price(self, obj):
        return "0.00"

    def get_total_deposit(self, obj):
        return "0.00"

class RentalOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalOrderItem
        fields = '__all__'

class RentalOrderSerializer(serializers.ModelSerializer):
    items = RentalOrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = RentalOrder
        fields = '__all__'
