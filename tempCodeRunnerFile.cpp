#include <iostream>
#include <vector>

using namespace std;

vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> result;
    size_t left_index = 0, right_index = 0;

    while (left_index < left.size() && right_index < right.size()) {
        if (left[left_index] < right[right_index]) {
            result.push_back(left[left_index]);
            left_index++;
        } else {
            result.push_back(right[right_index]);
            right_index++;
        }
    }

    // Ajouter les éléments restants
    while (left_index < left.size()) {
        result.push_back(left[left_index]);
        left_index++;
    }

    while (right_index < right.size()) {
        result.push_back(right[right_index]);
        right_index++;
    }

    return result;
}

vector<int> merge_sort(const vector<int>& array) {
    if (array.size() <= 1) {
        return array;
    }

    size_t middle = array.size() / 2;
    vector<int> left(array.begin(), array.begin() + middle);
    vector<int> right(array.begin() + middle, array.end());

    return merge(merge_sort(left), merge_sort(right));
}

int main() {
    vector<int> numbers = {1, 10, 0, 4, 9};
    vector<int> sorted_numbers = merge_sort(numbers);

    for (int num : sorted_numbers) {
        cout << num << " ";
    }
    cout << endl;

    return 0;
}